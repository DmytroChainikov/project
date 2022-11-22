import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("awesomeToken"));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("http://localhost:8000/api/users/me", requestOptions);

      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("awesomeToken", token);
    };
    fetchUser();
  }, [token]);
  const contextItems = {
    token, 
    fetchToken: (token) => {
      setToken(token);
    }
  };

  return (
    <UserContext.Provider value={contextItems}>
      {props.children}
    </UserContext.Provider>
  );
};
