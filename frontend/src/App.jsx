import React, { useContext, useEffect, useState } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { UserContext, UserProvider } from "./context/UserContext";

const App = () => {
  const [message, setMessage] = useState("");
  


  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "accept": "application/json",
      },
    };
    const response = await fetch("http://localhost:8000/api", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log("something messed up");
    } else {
      setMessage(data.message);
    }
  };

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  return (
    <>
      <UserProvider>
      <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {true ? (
            <div className="columns">
              <Register /> <Login />
            </div>
          ) : (
            <Dashboard />
          )}
        </div>
        <div className="column"></div>
      </div>
      </UserProvider>
    </>
  );
};

export default App;
