import React, { useState } from "react";
import App from "../App.tsx";
import axios from "axios";
import "./CompleteProfile.css";
// import { useHistory } from "react-router-dom";

function CompleteProfile() {
  const [age, setAge] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [goalWeight, setGoalWeight] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [error, setError] = useState("");

  function handleSetAge(e: any): void {
    setAge(e.target.value);
  }

  function handleSetHeight(e: any): void {
    setHeight(e.target.value);
  }

  function handleSetWeight(e: any): void {
    setWeight(e.target.value);
  }

  function handleSetGoalWeight(e: any): void {
    setGoalWeight(e.target.value);
  }

  function handleSetEmail(e: any): void {
    setEmail(e.target.value);
  }

  function handleSetGender(e: any): void {
    setGender(e.target.value);
  }

  async function doCompleteProfile(event: any): Promise<void> {
    event.preventDefault();
    let retrievedUser = null;
    //Get username from the user that created the account
    const userJson = localStorage.getItem("user_data");
    console.log(userJson);

    if (userJson != null) {
      retrievedUser = JSON.parse(userJson);
      console.log(userJson);
    } else {
      console.error("No user data found in localStorage");
    }

    var obj = {
      id: retrievedUser.id,
      Age: age,
      Weight: weight,
      //GoalWeight: goalWeight;
      Height: height,
      Email: email,
      Gender: gender,
      GoalWeight: goalWeight,
    };

    console.log(retrievedUser.id);
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/completeprofile",
        {
          method: "POST",
          body: js,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      var res = JSON.parse(await response.text());
      if (res.message === "Profile Updated") {
        var user = {
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("Profile Updated");
        window.location.href = "/";
        return;
      } else {
        setMessage(res.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  return (
    <div className="cpMainContainer">
      {/*Gradient Panel */}
      <>
        <div className="cpGradientPanel">
          <>
            <h2>Account created</h2>
            <p>Complete your profile to continue</p>
          </>
        </div>
      </>

      {/* Right Panel */}
      <>
        <div className="cpRightPanel">
          <div className="cpInputFields">
            GENDER
            <input
              type="text"
              placeholder="Enter your gender"
              onChange={handleSetGender}
            />
          </div>
          <div className="cpInputFields">
            AGE
            <input
              type="text"
              placeholder="Enter your age"
              onChange={handleSetAge}
            />
          </div>
          <div className="cpInputFields">
            HEIGHT
            <input
              type="text"
              placeholder="Enter your height (inches)"
              onChange={handleSetHeight}
            />
          </div>
          <div className="cpInputFields">
            WEIGHT
            <input
              type="text"
              placeholder="Enter your weight (lbs)"
              onChange={handleSetWeight}
            />
          </div>
          <div className="cpInputFields">
            GOAL WEIGHT
            <input
              type="text"
              placeholder="Enter your goal weight (lbs)"
              onChange={handleSetGoalWeight}
            />
          </div>
          <div className="cpInputFields">
            EMAIL
            <input
              type="text"
              placeholder="Enter your email"
              onChange={handleSetEmail}
            />
          </div>
          <span className="completeProfileResult">{message}</span>
          <button className="cpBtn" onClick={doCompleteProfile}>
            Save Profile
          </button>
        </div>
      </>
    </div>

    /*<div className="container">
      <h2 id="completeProfile">Complete Profile</h2>
      <span className="createAccountResult">{message}</span>
      <button className="btnCreateAccount" onClick={completeAccount}>
        Save
      </button>
      <div>
        <input
          type="text"
          placeholder="Enter Gender"
          onChange={handleSetGender}
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
      </div>{" "}
      
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
    </div>*/
  );
}

export default CompleteProfile;
