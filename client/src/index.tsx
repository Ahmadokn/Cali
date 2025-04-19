import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AssignmentsContextProvider } from "./context/AssignmentContext";
import { UserContextProvider } from "./context/UserContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <AssignmentsContextProvider>
        <App />
      </AssignmentsContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
