import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [message, setMessage] = React.useState("");
  const [loginName, setLoginName] = React.useState("");
  const [loginPassword, setPassword] = React.useState("");

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    var obj = { login: loginName, password: loginPassword };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/login",
        {
          method: "POST",
          body: js,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage("User/Password combination incorrect");
      } else {
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/cards";
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }
  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  return (
    <div id="outerBox">
      <div id="createAccountDiv">
        <input
          type="submit"
          id="createButton"
          className="buttons"
          value="Create Account"
        />
      </div>
      <div id="loginDiv">
        <span id="inner-title">Login</span>
        <br />
        <input
          type="text"
          id="loginName"
          placeholder="Username"
          onChange={handleSetLoginName}
        />
        <br />
        <input
          type="password"
          id="loginPassword"
          placeholder="Password"
          onChange={handleSetPassword}
        />
        <br />
        <input
          type="submit"
          id="loginButton"
          className="buttons"
          value="Sign in"
          onClick={doLogin}
        />
        <span id="loginResult">{message}</span>
      </div>
    </div>
  );
}
export default Login;
