import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = React.useState("");
  const [createAccountMessage, setCreateAccountMessage] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");

  //const [loginName, setLoginName] = React.useState("");
  // const [firstName, setFirstName] = React.useState("");
  // const [lastName, setLastName] = React.useState("");
  // const [password, setPassword] = React.useState("");

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    var obj = { userName: userName, password: loginPassword };
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
      console.log(res);
      if (res.message === "Login Successful") {
        setMessage(res.message);
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/homepage";
      } else {
        setMessage(res.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  async function doCreateAccount(event: any): Promise<void> {
    event.preventDefault();
    var obj = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      password: password,
    };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/createaccount",
        {
          method: "POST",
          body: js,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      var res = JSON.parse(await response.text());
      console.log("Entire Response ", res);

      if (res.message === "Account Created") {
        // setCreateAccountMessage(res.message);
        console.log("Response ", res.firstName);
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
          userName: res.userName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setCreateAccountMessage("Account Created");
        window.location.href = "/completeprofile";
      } else {
        setCreateAccountMessage(res.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  function handleSetFirstname(e: any): void {
    setFirstName(e.target.value);
  }

  function handleSetLastname(e: any): void {
    setLastName(e.target.value);
  }

  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  function toggleForm() {
    setIsSignUp(!isSignUp);
  }

  function handleSetUserName(e: any): void {
    setUserName(e.target.value);
  }
  function handleSetLoginPassword(e: any): void {
    setLoginPassword(e.target.value);
  }

  return (
    <div className={`mainContainer ${isSignUp ? "signUpActive" : ""}`}>
      {/* Left Panel */}
      <>
        <div className="leftPanel">
          <h2>Login</h2>
          <div className="inputFields">
            USERNAME
            <input
              type="text"
              placeholder="Enter username"
              onChange={handleSetUserName}
            />
          </div>
          <div className="inputFields">
            PASSWORD
            <input
              type="password"
              placeholder="Enter password"
              onChange={handleSetLoginPassword}
            />
          </div>
          <span className="loginResult">{message}</span>
          <button className="btn" onClick={doLogin}>
            Sign In
          </button>
        </div>
      </>

      {/* Right Panel */}
      <>
        <div className="rightPanel">
          <h2>Create account</h2>
          <div className="otherInputFields">
            FIRST NAME
            <input
              type="text"
              placeholder="Enter first name"
              onChange={handleSetFirstname}
            />
          </div>
          <div className="otherInputFields">
            LAST NAME
            <input
              type="text"
              placeholder="Enter last name"
              onChange={handleSetLastname}
            />
          </div>
          <div className="otherInputFields">
            USERNAME
            <input
              type="text"
              placeholder="Enter username"
              onChange={handleSetUserName}
            />
          </div>
          <div className="otherInputFields">
            PASSWORD
            <input
              type="password"
              placeholder="Enter password"
              onChange={handleSetPassword}
            />
          </div>
          <span className="createAccountResult">{createAccountMessage}</span>
          <button className="btn" onClick={doCreateAccount}>
            Create Account
          </button>
        </div>
      </>

      {/* Gradient Panel */}
      <>
        <div className="gradientPanel">
          {isSignUp ? (
            <>
              <h2>Welcome</h2>
              <p>Already have an account?</p>
              <button className="btnOther" onClick={toggleForm}>
                Login
              </button>
            </>
          ) : (
            <>
              <h2>Welcome, please login</h2>
              <p>Don't have an account?</p>
              <button className="btnOther" onClick={toggleForm}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </>
    </div>
  );
}
export default Login;
