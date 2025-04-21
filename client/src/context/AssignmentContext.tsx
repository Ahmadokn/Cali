import React, { createContext, useReducer } from "react";

export type Assignment = {
  _id: String;
  title: String;
  course: String;
  dueDate: Date;
  dueTime: string;
  description: string;
  priority: 'none' | 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  tags: string[];
  reminder: {
    enabled: boolean;
    offsetMinutes: number;
  };
  recurrence: {
    frequency: 'none' | 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type AssignmentsContextProviderProps = {
  children: React.ReactNode;
};

export const enum AssignmentOptions {
  SET_ASSIGNMENTS,
  CREATE_ASSIGNMENT,
  DELETE_ASSIGNMENT
}

export type ActionType = {
  type: AssignmentOptions;
  payload: any;
};

type AssignmentsStateType = {
  assignments: Assignment[];
};

export const AssignmentsContext = createContext<{
  assignmentsState: AssignmentsStateType;
  dispatch: React.Dispatch<ActionType>;
}>({ assignmentsState: { assignments: [] }, dispatch: () => null });

export const assignmentsReducer = (
  state: AssignmentsStateType,
  action: ActionType
) => {
  switch (action.type) {
    case AssignmentOptions.SET_ASSIGNMENTS:
      return {
        assignments: action.payload
      };
    case AssignmentOptions.CREATE_ASSIGNMENT:
      return {
        assignments: [action.payload, ...state.assignments].sort(
          (a, b) => +new Date(a.dueDate) - +new Date(b.dueDate)
        )
      };
    case AssignmentOptions.DELETE_ASSIGNMENT:
      return {
        assignments: state.assignments.filter(
          (a) => a._id !== action.payload._id
        )
      };
    default:
      return state;
  }
};

export const AssignmentsContextProvider = ({
  children
}: AssignmentsContextProviderProps) => {
  const [assignmentsState, dispatch] = useReducer(assignmentsReducer, {
    assignments: []
  });
  return (
    <AssignmentsContext.Provider value={{ assignmentsState, dispatch }}>
      {children}
    </AssignmentsContext.Provider>
  );
};
