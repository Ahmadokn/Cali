import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AssignmentDetails from "../components/AssignmentDetails";
import AssignmentForm from "../components/AssignmentForm";
import CalendarView from "../components/CalendarView";
import { AssignmentOptions } from "../context/AssignmentContext";
import { useAssignmentsContext } from "../hooks/useAssignmentsContext";
import { useUserContext } from "../hooks/useUserContext";
import { api } from "../constants";

const Home = () => {
  const { assignmentsState, dispatch } = useAssignmentsContext();
  const [showItems, setShowItems] = useState<boolean>(false);
  const { userState } = useUserContext();

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!userState.user) {
        return;
      }
      const response = await fetch(`${api}/assignments`, {
        headers: { Authorization: `Bearer ${userState.user.token}` }
      });
      const data = await response.json();
      if (response.ok) {
        dispatch({ type: AssignmentOptions.SET_ASSIGNMENTS, payload: data });
      }
    };

    if (userState) {
      fetchAssignments();
    }
  }, [dispatch, userState]);

  return (
    <div className="grid grid-cols-3 gap-x-24 bg-slate-100 pt-10 min-h-screen">
      <div className="col-span-2 pl-6">
        <CalendarView />
      </div>
      <div className="pr-10">
      <button
        onClick={() => setShowItems(prev => !prev)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {showItems ? "Hide Items" : "Show Items"}
      </button>
      <AssignmentForm />
      {showItems && (
        <div className="mt-4 bg-slate-100 rounded">
          {assignmentsState.assignments.map((assignment) => (
            <AssignmentDetails
              key={uuidv4()}
              assignment={assignment}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
