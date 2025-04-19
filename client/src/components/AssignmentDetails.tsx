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
    <div className="relative border border-slate-300 rounded-lg bg-white m-2 p-4 pr-6 max-w-sm w-full shadow">
      <h3 className="text-xl mb-10">
        <strong>{assignment.title}</strong>
      </h3>
      <p>
        <strong>Course:</strong> {assignment.course}
      </p>
      <p>
        <strong>Due Date:</strong> {formattedDueDate}
      </p>
      <p>
        <strong>Priority:</strong> {assignment.priority}
      </p>
      <button
        onClick={handleClick}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white p-2 rounded text-sm">
        Delete
      </button>
    </div>
  );
};

export default AssignmentDetails;
