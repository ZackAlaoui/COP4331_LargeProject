import React, { useEffect, useState } from "react";
import App from "../App.tsx";
import "./EditProfile.css";
import { json } from "react-router-dom";

function EditProfile() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [goalweight, setGoalWeight] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [age, setAge] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  function redirectToLogin() {
    window.location.href = "/";
  }

  function redirectToDashboard() {
    window.location.href = "/homepage";
  }

  async function updateUserInfo(event: any): Promise<void> {
    var storedData = localStorage.getItem("user_data");

    if (!storedData) {
      return;
    }

    var parsedData;
    try {
      parsedData = JSON.parse(storedData);

      if (!parsedData.id) {
        throw new Error("ID not found in parsed data");
      }

      var obj = {
        id: parsedData.id,
        FirstName: firstName,
        LastName: lastName,
        UserName: userName,
        // Password : password,
        Gender: gender,
        Age: age,
        Height: height,
        Weight: weight,
        GoalWeight: goalweight,
        Email: email,
      };

      console.log(obj);

      //Converting our object to a string before sending to our API
      var js = JSON.stringify(obj);

      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/updateUserInfo",
        {
          method: "POST",
          body: js,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = JSON.parse(await response.text());
      console.log(res);

      if (res.message === "Updated User") {
        var userId = {
          id: res.id,
        };

        localStorage.setItem("user_data", JSON.stringify(userId));
        setMessage("Updated!");
        return;
      } else {
        setMessage(res.message);
        return;
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  useEffect(() => {
    async function loadUserInfo() {
      var storedData = localStorage.getItem("user_data");

      if (!storedData) {
        return;
      }

      var parsedData;
      try {
        parsedData = JSON.parse(storedData);
        console.log(parsedData);

        if (!parsedData.id) {
          console.log("id not found");
          throw new Error("ID not found in parsed data");
        }

        var obj = {
          id: parsedData.id,
        };

        //Converting our object to a string before sending to our API
        var js = JSON.stringify(obj);

        const response = await fetch(
          "https://lp.largeprojectnutrition.fit/api/getUserInfo",
          {
            method: "POST",
            body: js,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const res = JSON.parse(await response.text());
        console.log(res);

        if (res.message === "Found") {
          setFirstName(res.FirstName);
          setLastName(res.LastName);
          setUserName(res.UserName);
          setGender(res.Gender);
          setAge(res.Age);
          setHeight(res.Height);
          setWeight(res.Weight);
          setGoalWeight(res.GoalWeight);
          setEmail(res.Email);

          var userId = {
            id: res.id,
          };

          localStorage.setItem("user_data", JSON.stringify(userId));
          return;
        } else {
          setMessage(res.message);
          return;
        }
      } catch (error: any) {
        alert(error.toString());
        return;
      }
    }

    loadUserInfo();
  }, []); //This useEffect will run once when the component mounts

  return (
    <div className="containerEditProfile">
      <button id="logout" onClick={() => redirectToLogin()}>
        Logout
      </button>
      <button id="goToDashboard" onClick={() => redirectToDashboard()}>
        Go to Dashboard
      </button>
      <h1 className="editProfile">Edit Profile</h1>
      <label className="editProfileLabel" htmlFor="FirstName">
        First Name
      </label>
      <input
        className="editProfileInput"
        type="text"
        id="FirstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <label className="editProfileLabel" htmlFor="LastName">
        Last Name
      </label>
      <input
        className="editProfileInput"
        type="text"
        id="LastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <label className="editProfileLabel" htmlFor="UserName">
        Username
      </label>
      <input
        className="editProfileInput"
        type="text"
        id="UserName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <label className="editProfileLabel" htmlFor="Gender">
        Gender
      </label>
      <input
        className="editProfileInput"
        type="text"
        id="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />
      <label className="editProfileLabel" htmlFor="Age">
        Age
      </label>
      <input
        className="editProfileInput"
        type="number"
        id="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <label className="editProfileLabel" htmlFor="Height">
        Height
      </label>
      <input
        className="editProfileInput"
        type="number"
        id="Height"
        value={height}
        onChange={(e) => setHeight(e.target.value)} 
      />
      <label className="editProfileLabel" htmlFor="Weight">
        Weight
      </label>
      <input
        className="editProfileInput"
        type="number"
        id="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <label className="editProfileLabel" htmlFor="GoalWeight">
      GoalWeight
      </label>
      <input
        className="editProfileInput"
        type="goalweight"
        id="GoalWeight"
        value={goalweight}
        onChange={(e) => setGoalWeight(e.target.value)}
      />
      <label className="editProfileLabel" htmlFor="Email">
        Email
      </label>
      <input
        className="editProfileInput"
        type="email"
        id="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="editProfileButton" onClick={updateUserInfo}>
        Update
      </button>
      {message && <div className="UpdateInfoSuccess">{message}</div>}
    </div>
  );
}

export default EditProfile;
