import React, { useState } from "react";

function CreateAccount() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [age, setAge] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [reenterPassword, setPasswordAgain] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  function handleSetFirstname(e: any): void {
    setFirstName(e.target.value);
  }

  function handleSetLastname(e: any): void {
    setLastName(e.target.value);
  }

  function handleSetUsername(e: any): void {
    setUserName(e.target.value);
  }

  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  function handleSetAge(e: any): void {
    setAge(e.target.value);
  }

  function handleSetHeight(e: any): void {
    setLastName(e.target.value);
  }

  function handleSetWeight(e: any): void {
    setWeight(e.target.value);
  }

  function handleSetEmail(e: any): void {
    setEmail(e.target.value);
  }

  async function doCreateAccount(event: any): Promise<void> {
    event.preventDefault();
    var obj = {};
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/createAccount",
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
        setMessage("Unable to create account");
      } else {
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
          username: res.username,
          password: res.password,
          age: res.age,
          height: res.height,
          weight: res.weight,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/";
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  return (
    <div className="container">
      <h2 id="createAccount">CreateAccount</h2>
      <div className="createAccountFields">
        <input
          type="text"
          placeholder="Enter Firstname"
          onChange={handleSetFirstname}
        />
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Enter Lastname"
          onChange={handleSetLastname}
        />
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Enter Username"
          onChange={handleSetUsername}
        />
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Enter Password"
          onChange={handleSetPassword}
        />
      </div>
      <br />
      <div>
        <input type="text" placeholder="Enter Age" onChange={handleSetAge} />
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Enter Height"
          onChange={handleSetHeight}
        />
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Enter Weight"
          onChange={handleSetWeight}
        />
      </div>
      <br />
      <div>
        <input
          type="text"
          placeholder="Enter Email"
          onChange={handleSetEmail}
        />
      </div>
      <br />
      <button className="btnCreateAccount" onClick={doCreateAccount}>
        Create Account
      </button>
    </div>
  );
}

export default CreateAccount;
