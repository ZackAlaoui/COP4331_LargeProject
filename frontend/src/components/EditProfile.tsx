import React, { useState } from "react";
import App from "../App.tsx";
import "./EditProfile.css";

function EditProfile() {
  return (
    <div className="containerEditProfile">
      <h2 id="editProfile">Edit Profile</h2>
      <div className="Inputs">
        FIRST NAME
        <input type="text" placeholder="FIRST NAME" />
      </div>
      <br />
      <div className="Inputs">
        LAST NAME
        <input type="text" placeholder="LAST NAME" />
      </div>
      <br />
      <div className="Inputs">
        USERNAME
        <input type="text" placeholder="USERNAME" />
      </div>
      <br />
      <div className="Inputs">
        PASSWORD
        <input type="text" placeholder="Change Password" />
      </div>
      <br />
      <div className="Inputs">
        GENDER
        <input type="text" placeholder="Gender" />
      </div>
      <br />
      <div className="Inputs">
        {" "}
        AGE
        <input type="text" placeholder="AGE" />
      </div>
      <br />
      <div className="Inputs">
        HEIGHT
        <input type="text" placeholder="Height" />
      </div>
      <br />
      <div className="Inputs">
        WEIGHT
        <input type="text" placeholder="Weight" />
      </div>
      <br />
      <div className="Inputs">
        EMAIL
        <input type="text" placeholder="Email" />
      </div>
    </div>
  );
}

export default EditProfile;
