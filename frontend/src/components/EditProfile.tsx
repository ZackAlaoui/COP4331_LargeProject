import React, { useEffect, useState } from "react";
import App from "../App.tsx";
import "./EditProfile.css";
import { json } from "react-router-dom";

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
      <h2 id="editProfile">Edit Profile</h2>
      <label htmlFor="firstName">FIRST NAME</label>
      <input
        type="text"
        id="firstName"
        value={firstName || ""}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <br />
      <label htmlFor="Lastname">LASTNAME </label>
      <input
        type="text"
        id="Lastnamr"
        value={lastName || ""}
        onChange={(e) => setLastName(e.target.value)}
      />
      <br />
      <label htmlFor="Username">USERNAME </label>
      <input
        type="text"
        id="Username"
        value={userName || ""}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <label htmlFor="Gender">GENDER </label>
      <input
        type="text"
        id="Gender"
        value={gender || ""}
        onChange={(e) => setGender(e.target.value)}
      />
      <br />
      <label htmlFor="Age">AGE </label>
      <input
        type="text"
        id="Age"
        value={age || ""}
        onChange={(e) => setAge(e.target.value)}
      />
      <br />
      <label htmlFor="Height">HEIGHT </label>
      <input
        type="text"
        id="Height"
        value={height || ""}
        onChange={(e) => setHeight(e.target.value)}
      />
      <br />
      <label htmlFor="Weight">WEIGHT </label>
      <input
        type="text"
        id="Weight"
        value={weight || ""}
        onChange={(e) => setWeight(e.target.value)}
      />
      <br />
      <label htmlFor="Email">EMAIL </label>
      <input
        type="text"
        id="Email"
        value={email || ""}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <span className="UpdateInfoSuccess">{message}</span>
      <button onClick={updateUserInfo}>Update your Information</button>
    </div>
  );
}

export default EditProfile;
