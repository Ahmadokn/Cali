import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUserContext } from "./hooks/useUserContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./styles/styles.css";
import CalendarView from './components/CalendarView';
import PomodoroTimer from './components/PomodoroTimer';
import ChatView from './components/ChatView';

const App = () => {
  const { userState } = useUserContext();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={userState.user ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!userState.user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!userState.user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/calendar"
          element={
            userState.user ? <CalendarView /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/pomodoro"
          element={
            userState.user ? <PomodoroTimer /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/chat"
          element={
            userState.user ? <ChatView /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
