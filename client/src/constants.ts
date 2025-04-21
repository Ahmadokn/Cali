// Use localhost during development, otherwise call relative API path
export const api =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API_URL || "http://localhost:4000/api"
    : `${window.location.origin}/api`;
