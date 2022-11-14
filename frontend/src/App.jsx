import React, { useContext, useEffect, useState } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { UserContext } from "./context/UserContext";

const App = () => {
  const [message, setMessage] = useState("");
  const userContext = useContext(UserContext);
  if (!UserContext) {
    console.log("no data");
  }
  const {token} = userContext;

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api", requestOptions);
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
      <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {!token ? (
            <div className="columns">
              <Register /> <Login />
            </div>
          ) : (
            <Dashboard />
          )}
        </div>
        <div className="column"></div>
      </div>
    </>
  );
};

export default App;
