import React, { useState } from 'react';
import { api } from "../constants";
import { Assignment, AssignmentOptions } from "../context/AssignmentContext";
import { useAssignmentsContext } from "../hooks/useAssignmentsContext";
import { useUserContext } from "../hooks/useUserContext";

type AssignmentDetailsProps = {
  assignment: Assignment;
};

const AssignmentDetails = ({ assignment }: AssignmentDetailsProps) => {
  const { dispatch } = useAssignmentsContext();
  const { userState } = useUserContext();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Create format for due date
  const dueDate = new Date(assignment.dueDate);
  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec."
  ];
  const dueDateYear = dueDate.getUTCFullYear();
  const dueDateMonth = months[dueDate.getUTCMonth()];
  const dueDateDay = dueDate.getUTCDate();
  const formattedDueDate = dueDateMonth + " " + dueDateDay + ", " + dueDateYear;

  const handleClick = async () => {
    if (!userState.user) {
      return;
    }
    const response = await fetch(`${api}/assignments/${assignment._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userState.user.token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      dispatch({ type: AssignmentOptions.DELETE_ASSIGNMENT, payload: data });
    }
  };

  return (
    <div className="relative border border-slate-300 rounded-lg bg-white m-1 p-2 max-w-xs w-full shadow">
      <button
        onClick={() => setShowDetails(prev => !prev)}
        className="mb-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
      >
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      <h3 className="text-lg mb-4">
        <strong>{assignment.title}</strong>
      </h3>
      <p>
        <strong>Course:</strong> {assignment.course}
      </p>
      {showDetails && (
        <>
          <p>
            <strong>Due Date:</strong> {formattedDueDate}
          </p>
          <p>
            <strong>Due Time:</strong> {assignment.dueTime}
          </p>
          <p>
            <strong>Priority:</strong> {assignment.priority}
          </p>
          <p>
            <strong>Status:</strong> {assignment.status}
          </p>
          <p>
            <strong>Description:</strong> {assignment.description}
          </p>
          <p>
            <strong>Tags:</strong> {assignment.tags && assignment.tags.join(', ')}
          </p>
          <p>
            <strong>Reminder:</strong>{" "}
            {assignment.reminder.enabled
              ? `Enabled (${assignment.reminder.offsetMinutes} min before)`
              : "Disabled"}
          </p>
          <p>
            <strong>Recurrence:</strong>{" "}
            {assignment.recurrence.frequency === "none"
              ? "None"
              : `${assignment.recurrence.frequency} every ${assignment.recurrence.interval}`}
          </p>
        </>
      )}
      <button
        onClick={handleClick}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white p-2 rounded text-sm">
        Delete
      </button>
    </div>
  );
};

export default AssignmentDetails;
