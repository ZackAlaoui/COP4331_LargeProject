import React, { useState } from "react";
import "./Home.css";

function redirectPage() {
  window.location.href = "/";
}

//When user clicks Profile it will redirect them to a page
function editProfile() {
  window.location.href = "/editprofile";
}

function WellnessPro() {
  const [currentWeight, setCurrentWeight] = useState<number>(70);
  const [message, setMessage] = React.useState("");

  const goalWeight: number = 65;

  async function modifyWeight(event: any): Promise<void> {
    event.preventDefault();
    //Get user_data from local storage
    var storedData = localStorage.getItem("user_data");

    if (storedData) {
      var parsedData = JSON.parse(storedData);
      console.log(parsedData);
    } else {
      console.log("No data was found in local storage using user_data as key");
    }

    var obj = {
      CurrentWeight: currentWeight,
      id: parsedData.id,
    };

    //Convert Javascript object to a JSON string
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/editWeight",
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

      if (res.message === "Updated Weight") {
        console.log("Response ", res.message);

        var user = {
          id: res.id,
        };

        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("Updated Weight");
      } else {
        setMessage(res.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  // Set current weight equal to the adjusted weight
  const handleWeightChange = (change: number): void => {
    setCurrentWeight(currentWeight + change);
  };

  const dailyCalories = {
    Sunday: 2200,
    Monday: 2000,
    Tuesday: 2100,
    Wednesday: 1900,
    Thursday: 2050,
    Friday: 2200,
    Saturday: 2300,
  };

  return (
    <div id="homeContainer">
      {/* Navigation Bar */}
      <div id="topNav">
        <button id="profileButton" onClick={() => editProfile()}>
          Profile
        </button>
        <button id="logoutButton" onClick={() => redirectPage()}>
          Logout
        </button>
      </div>

      {/* Wellness Pro Title */}
      <h1 id="wellnessTitle">Wellness Pro</h1>

      {/* Days of the Week with Hardcoded Calories */}
      <div className="daysOfWeek">
        {Object.entries(dailyCalories).map(([day, calories]) => (
          <div key={day} className="dayBox">
            <p className="dayName">{day}</p>
            <p>{calories} kcal</p>
          </div>
        ))}
      </div>

      {/* Current Weight and Goal Weight Section */}
      <div className="weightInfo">
        <div>
          <p>
            <strong>Current Weight:</strong>
          </p>
          <p>{currentWeight} lb</p>
        </div>
        <div>
          <p>
            <strong>Goal Weight:</strong>
          </p>
          <p>{goalWeight} lb</p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mainContent">
        {/* Calorie Tracker Section */}
        <div className="calorieTracker">
          <div className="calorieGoalRow">
            <p>
              Calorie Goal: <strong>2000</strong>
            </p>
            <p>
              Calorie Remaining: <strong>800</strong>
            </p>
          </div>

          {/* Meal Inputs */}
          <div className="mealInputs">
            <div className="mealInput">
              <p>Breakfast</p>
              <button className="addFoodButton">+ Add Food</button>
            </div>
            <div className="mealInput">
              <p>Lunch</p>
              <button className="addFoodButton">+ Add Food</button>
            </div>
          </div>
          <div className="mealInputs">
            <div className="mealInput">
              <p>Dinner</p>
              <button className="addFoodButton">+ Add Food</button>
            </div>
            <div className="mealInput">
              <p>Snacks</p>
              <button className="addFoodButton">+ Add Food</button>
            </div>
          </div>

          {/* Exercise Input 
          <div className="exerciseInput">
            <p>Exercise</p>
            <input
              type="text"
              placeholder="Search and add exercise"
              className="exerciseSearch"
            />
          </div>
        </div> */}

        {/* Adjust Weight Section */}
        <div className="adjustWeight lowerSection">
          <p>
            <button
              onClick={() => handleWeightChange(1)}
              className="circleButton"
            >
              +
            </button>
            {currentWeight} kg
            <button
              onClick={() => handleWeightChange(-1)}
              className="circleButton"
            >
              -
            </button>
          </p>
          <p>
            <span className="updateResultWeight">{message}</span>
            <button onClick={modifyWeight}>Update</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default WellnessPro;
