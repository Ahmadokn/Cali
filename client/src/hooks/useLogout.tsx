import { useUserContext } from "./useUserContext";
import { UserOptions } from "../context/UserContext";
import { useAssignmentsContext } from "./useAssignmentsContext";
import { AssignmentOptions } from "../context/AssignmentContext";

export const useLogout = () => {
  const { dispatch: userDispatch } = useUserContext();
  const { dispatch: assignmentsDispatch } = useAssignmentsContext();

  const logout = () => {
    localStorage.removeItem("user");
    userDispatch({ type: UserOptions.LOGOUT, payload: null });
    assignmentsDispatch({
      type: AssignmentOptions.SET_ASSIGNMENTS,
      payload: null
    });
  };

  return { logout };
};
