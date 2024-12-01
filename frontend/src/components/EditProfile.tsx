import React, { useEffect, useState } from "react";
import App from "../App.tsx";
import "./EditProfile.css";

function EditProfile() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [age, setAge] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  function updateUserInfo() {}

  useEffect(() => {
    async function loadUserInfo() {
      var storedData = localStorage.getItem("user_data");

      if (!storedData) {
        console.error("No data found in local storage");
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

        console.log("Id was found", parsedData.id);
        var obj = {
          id: parsedData.id,
        };

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

        if (res.message === "Found") {
          setFirstName(res.FirstName);
          setLastName(res.LastName);
          setUserName(res.UserName);
          setGender(res.Gender);
          setAge(res.Age);
          setHeight(res.Height);
          setWeight(res.Weight);
          setEmail(res.Email);
        } else {
          setMessage(res.message);
        }
      } catch (error: any) {
        alert(error.toString());
        return;
      }
    }

    console.log("About to call loadUser info");
    loadUserInfo();
  }, []); //This useEffect will run once when the component mounts

  return (
    <div className="containerEditProfile">
      <h2 id="editProfile">Edit Profile</h2>
      <div className="Inputs">
        FIRST NAME
        <input
          type="text"
          value={firstName || ""}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        LAST NAME
        <input
          type="text"
          value={lastName || ""}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        USERNAME
        <input
          type="text"
          value={userName || ""}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        PASSWORD
        <input
          type="text"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        GENDER
        <input
          type="text"
          value={gender || ""}
          onChange={(e) => setGender(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        {" "}
        AGE
        <input
          type="text"
          value={age || ""}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        HEIGHT
        <input
          type="text"
          value={height || ""}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        WEIGHT
        <input
          type="text"
          value={weight || ""}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      <br />
      <div className="Inputs">
        EMAIL
        <input
          type="text"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="UpdateProfileInfo">
        <br />
        <span className="UpdateInfoSuccess">{message}</span>
        <button onClick={updateUserInfo}>Update your Information</button>
      </div>
    </div>
  );
}

export default EditProfile;
