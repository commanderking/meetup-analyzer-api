import React, { useEffect } from "react";

const LoginContainer = ({ auth }: any) => {
  const { isAuthenticated, login, logout, renewSession } = auth;

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      renewSession();
    }
  }, [renewSession]);
  return (
    <div>
      {!isAuthenticated() && (
        <button
          onClick={() => {
            login();
          }}
        >
          Login
        </button>
      )}
      {isAuthenticated() && (
        <button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default LoginContainer;
