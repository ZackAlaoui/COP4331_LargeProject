import React, { useState } from "react";
import "./Home.css";

function WellnessPro() {
  const [currentWeight, setCurrentWeight] = useState<number>(70);
  const goalWeight: number = 65;

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
        <button id="profileButton">Profile</button>
        <button id="logoutButton">Logout</button>
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

          {/* Exercise Input */}
          <div className="exerciseInput">
            <p>Exercise</p>
            <input
              type="text"
              placeholder="Search and add exercise"
              className="exerciseSearch"
            />
          </div>
        </div>

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
        </div>
      </div>
    </div>
  );
}

export default WellnessPro;
