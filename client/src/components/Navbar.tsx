import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useUserContext } from "../hooks/useUserContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { userState } = useUserContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="relative w-full flex flex-wrap items-center justify-between px-14 py-4 bg-gray-100 shadow-lg navbar navbar-expand-lg navbar-light">
      <Link to="/">
        <h1 className="text-4xl">Cali</h1>
      </Link>
      {userState.user ? (
        <div className="flex items-center space-x-4">
          <span className="pr-5">{userState.user.email}</span>
          <Link
            to="/calendar"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Calendar
          </Link>
          <Link
            to="/pomodoro"
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Pomodoro
          </Link>
          <Link
            to="/chat"
            className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Chat
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link to="/login" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            Login
          </Link>
          <Link to="/signup" className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
