import { useState } from "react";
import { useUserContext } from "./useUserContext";
import { UserOptions } from "../context/UserContext";
import { api } from "../constants";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useUserContext();

  const signup = async (email: String, password: String) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${api}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(data.error);
    } else if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: UserOptions.LOGIN, payload: data });
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
