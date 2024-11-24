import React, { useState } from "react";

function CreateAccount() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const [age, setAge] = React.useState("");
  // const [weight, setWeight] = React.useState("");
  // const [height, setHeight] = React.useState("");
  // const [reenterPassword, setPasswordAgain] = React.useState("");
  // const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  // const [gender, setGender] = React.useState("");

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

  // function handleSetAge(e: any): void {
  //   setAge(e.target.value);
  // }

  // function handleSetHeight(e: any): void {
  //   setLastName(e.target.value);
  // }

  // function handleSetWeight(e: any): void {
  //   setWeight(e.target.value);
  // }

  // function handleSetEmail(e: any): void {
  //   setEmail(e.target.value);
  // }

  // function handleSetGender(e: any): void {
  //   setGender(e.target.value);
  // }

  async function doCreateAccount(event: any): Promise<void> {
    event.preventDefault();
    var obj = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
    };
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
      if (res.complete != "user added") {
        setMessage("Unable to create account");
      } else {
        var user = {
          FirstName: res.firstName,
          LastName: res.lastName,
          UserName: res.username,
          Password: res.password,
          // Gender: res.gender,
          // Age: res.age,
          // Height: res.height,
          // Weight: res.weight,
          // Email: res.email,
          // UserId: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("Account Created");
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
    //window.location.href = "/";
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
      <span className="createAccountResult">{message}</span>
      <button className="btnCreateAccount" onClick={doCreateAccount}>
        Create Account
      </button>
      {/* <div>
        <input
          type="text"
          placeholder="Enter Gender"
          onChange={handleSetGender}
        />
      </div> */}
      {/* <br />
      <div>
        <input type="text" placeholder="Enter Age" onChange={handleSetAge} />
      </div>
      <br /> */}
      {/* <div>
        <input
          type="text"
          placeholder="Enter Height"
          onChange={handleSetHeight}
        />
      </div> */}
      {/* <br />
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
      </div> */}
    </div>
  );
}

export default CreateAccount;
