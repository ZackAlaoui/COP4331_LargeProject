import React, { useEffect, useState } from "react";
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
  const [goalWeight, setGoalWeight] = useState<number>(70);
  const [message, setMessage] = React.useState("");
  const [showAddFoodWindow, setShowAddFoodWindow] = useState(false);

  //This is a useState that will set searchTerm to the input we provide it
  const [searchTerm, setSearchTerm] = useState("");

  //foodList will contain the array of foods
  const [foodList, setFoodList] = useState([]);
  const [currentDay, setCurrentDay] = React.useState("Sunday");

  useEffect(() => {
    async function fetchGoalWeight() {
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
        };

        console.log(obj);

        //Converting our object to a string before sending to our API
        var js = JSON.stringify(obj);

        const response = await fetch(
          "https://lp.largeprojectnutrition.fit/api/goalWeight",
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
          setGoalWeight(res.GoalWeight);
          setCurrentWeight(Number(res.Weight));
          console.log(typeof currentWeight);
          console.log(currentWeight);
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

    //call the function
    fetchGoalWeight();
  }, []);

  async function handleSearch() {
    var obj = {
      query: searchTerm,
      pageSize: 10,
    };

    console.log(obj);

    if (!searchTerm.trim()) {
      console.log("query is empty");
      return;
    }

    var js = JSON.stringify(obj);

    try {
      const response = await fetch(
        `https://lp.largeprojectnutrition.fit/api/search`,
        {
          method: "POST",
          body: js,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      var res = await response.json();
      if (res.error === "Search cannot be empty.") {
        console.log("query is empty");
      }

      setFoodList(res.results); //Update the state with the food data
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  }

  const handleAddFoodClick = () => {
    setShowAddFoodWindow(true);
  };

  const handleClosePopUp = () => {
    setShowAddFoodWindow(false);
  };

  // const goalWeight: number = 65;

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

        // setCurrentWeight(Number(res.Weight));

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
    setCurrentWeight((currentWeight) => Number(currentWeight) + change);
  };

  async function handleGrabDailyInfo(day: string, event: any): Promise<void> {
    setCurrentDay(day);
  }

  // Modify calories for different days of the week
async function modifyCalories(event: any): Promise<void> {
  event.preventDefault();
  
  // Get user_data from local storage
  var storedData = localStorage.getItem("user_data");

  if (storedData) {
    var parsedData = JSON.parse(storedData);
    console.log(parsedData);
  } else {
    console.log("No data was found in local storage using user_data as key");
    return;
  }

  // Get the day and new calorie count from the form or event
  const { day, calories } = event.target; // Assuming day and calories are part of the form
  if (!day || !calories) {
    console.log("Day and calories are required");
    return;
  }

  // Prepare the object with updated calories information
  var obj = {
    id: parsedData.id,
    day: day,       // Example: 'Monday', 'Tuesday', etc.
    calories: calories, // Updated calorie count
  };

  // Convert JavaScript object to a JSON string
  var js = JSON.stringify(obj);

  try {
    // Send the updated calories data to the API
    const response = await fetch("https://lp.largeprojectnutrition.fit/api/editCalories", {
      method: "POST",
      body: js,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    var res = JSON.parse(await response.text());
    console.log("Entire Response ", res);

    // If the response indicates success, update the local storage
    if (res.message === "Updated Calories") {
      console.log("Response: ", res.message);

      // Assuming you have the updated data, store it back in localStorage
      var user = {
        id: res.id,
        caloriesData: res.updatedCaloriesData, // Assuming this is returned in the response
      };

      localStorage.setItem("user_data", JSON.stringify(user));
      setMessage("Updated Calories");
    } else {
      setMessage(res.message); // Show any other message from the response
    }
  } catch (error: any) {
    alert(error.toString());
    return;
  }
}

// This function can be used to modify calories for each day
const handleCaloriesChange = (day: string, newCalories: number): void => {
  // Get the current user data from localStorage
  let storedData = localStorage.getItem("user_data");
  if (storedData) {
    let parsedData = JSON.parse(storedData);

    // Modify the calories for the specified day
    let updatedCaloriesData = parsedData.caloriesData || {};
    updatedCaloriesData[day] = newCalories;

    // Update localStorage with the new calories data
    parsedData.caloriesData = updatedCaloriesData;
    localStorage.setItem("user_data", JSON.stringify(parsedData));

    console.log(`Updated calories for ${day}: ${newCalories}`);
  }
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
          <div
            key={day}
            className="dayBox"
            onClick={() => handleGrabDailyInfo(day)}
          >
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
          <p id="currentDayInBox">{currentDay}</p>
          <div className="calorieGoalRow">
            <p>
              Calorie Goal: <strong>2000</strong>
            </p>
            <p>
              Calorie Remaining: <strong>800</strong>
            </p>
          </div>

          {/* Meal Inputs */}

          {showAddFoodWindow && (
            <div className="popupOverlay">
              <div className="popupWindow">
                <h2 id="TitlePopUp">Add Food</h2>

                {/*Search Bar */}
                <div className="searchContainer">
                  <input
                    type="text"
                    id="searchBar"
                    placeholder="Search Food name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button id="searchButton" onClick={handleSearch}>
                    Search Food
                  </button>
                </div>

                {/*Display Food List */}
                {foodList.length > 0 && (
                  <ul className="foodList">
                    {foodList.map((food, index) => (
                      <li key={index} className="foodItem">
                        <p>
                          <strong>Brand:</strong> {food.brandName}
                        </p>
                        <p>
                          <strong>Calories:</strong> {food.calories}(Kcal)
                        </p>
                        <p>
                          <strong>Protein:</strong> {food.protein}(grams)
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="popupActions">
                  <button id="closeButton" onClick={handleClosePopUp}>
                    &times;
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mealInputs">
            <div className="mealInput">
              <p>Breakfast</p>

              <button className="addFoodButton" onClick={handleAddFoodClick}>
                + Add Food
              </button>
              <button className="deleteFoodButton">- Delete Food</button>
            </div>
            <div className="mealInput">
              <p>Lunch</p>
              <button className="addFoodButton" onClick={handleAddFoodClick}>
                + Add Food
              </button>
              <button className="deleteFoodButton">- Delete Food</button>
            </div>
          </div>
          <div className="mealInputs">
            <div className="mealInput">
              <p>Dinner</p>

              <button className="addFoodButton" onClick={handleAddFoodClick}>
                + Add Food
              </button>
              <button className="deleteFoodButton">- Delete Food</button>
            </div>
            <div className="mealInput">
              <p>Snacks</p>
              <button className="addFoodButton">+ Add Food</button>
              <button className="deleteFoodButton">- Delete Food</button>
            </div>
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
