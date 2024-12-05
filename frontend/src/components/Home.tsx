import React, { useEffect, useState } from "react";
import "./Home.css";

function redirectPage() {
  window.location.href = "/";
}

//When user clicks Profile it will redirect them to a page
function editProfile() {
  window.location.href = "/editprofile";
}

interface FoodItem {
  id: Number;
  description: string;
  brandName: string;
  calories: Number; // Access calories by nutrient name
  protein: Number; // Access protein by nutrient name
  foodId: Number; // Store the food's unique fdcId
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
  const [listOfFoods, setListOfFoods] = useState<FoodItem[]>([]);

  const [currentDay, setCurrentDay] = React.useState("Wednesday");

  const [caloriesRemaining, setCurrentCalories] = useState<number>(2000);
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);

  const handleSetListOfFoods = (newFood: FoodItem) => {
    setListOfFoods((prevFoods) => [...prevFoods, newFood]); //Add new food to the list
  };

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
        console.log(calorieGoal);

        var obj = {
          id: parsedData.id,
          CalorieGoal: calorieGoal, //Send value 2000 for goal calories
        };
        console.log(calorieGoal);
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
          setCalorieGoal(Number(res.CalorieGoal));
          console.log(typeof currentWeight);
          console.log(res.calorieGoal);
          console.log(currentWeight);
          var userData = {
            id: res.id,
            CalorieGoal: res.CalorieGoal,
            Weight: res.Weight,
            GoalWeight: res.GoalWeight,
          };

          localStorage.setItem("user_data", JSON.stringify(userData));
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

  //Create a handler to remove a food from the listOfFoods array
  async function handleDeleteFood(foodId: Number): Promise<void> {
    // event.preventDefault();
    setListOfFoods((prevFoods) =>
      prevFoods.filter((food) => food.id !== foodId)
    );
    var storedData = localStorage.getItem("user_data");

    if (storedData) {
      var parsedData = JSON.parse(storedData);
      console.log(parsedData);
    } else {
      console.log("No data was found in local storage using user_data as key");
    }

    var obj = {
      id: parsedData.id,
      foodId: foodId,
    };

    console.log(obj);

    //Convert Javascript object to a JSON string
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/delete",
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

      if (res.message === "Food item deleted successfully") {
        console.log("Response ", res.message);

        var user = {
          id: res.id,
        };

        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("Updated listOfFoods array");
      } else {
        setMessage(res.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

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

  async function addCalories(newfoodId: number, Day: number): Promise<void> {
    //Get user_data from local storage
    var storedData = localStorage.getItem("user_data");

    if (storedData) {
      var parsedData = JSON.parse(storedData);
      console.log(parsedData);
    } else {
      console.log("No data was found in local storage using user_data as key");
    }

    // Extract foodId from the event or input (depending on your form setup)
    //const { foodId } = event.target; // Assuming foodId and currentCalories are available in the event

    if (!newfoodId || !Day) {
      console.log("Food ID and day is required");
      return; // Exit if foodId or currentCalories is missing
    }

    var obj = {
      foodId: newfoodId,
      day: Day,
      id: parsedData.id
    };

    //Convert Javascript object to a JSON string
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/add",
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

      if (res.message === "added Calories") {
        console.log("Response ", res.message);

        var user = {
          id: res.id,
        };

      if (response.ok) {
        console.log("Food item added successfully:", result);
        handleSetListOfFoods(result.foodItem);
      } else {
        setMessage(res.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  async function subtractCalories(newfoodId: number, Day: number): Promise<void> {
    //Get user_data from local storage
    var storedData = localStorage.getItem("user_data");

    if (storedData) {
      var parsedData = JSON.parse(storedData);
      console.log(parsedData);
    } else {
      console.log("No data was found in local storage using user_data as key");
    }

    // Extract foodId from the event or input (depending on your form setup)
    //const { foodId } = event.target; // Assuming foodId and currentCalories are available in the event

    if (!newfoodId || !Day) {
      console.log("Food ID and day is required");
      return; // Exit if foodId or currentCalories is missing
    }

    var obj = {
      foodId: newfoodId,
      day: Day,
      id: parsedData.id
    };

    //Convert Javascript object to a JSON string
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(
        "https://lp.largeprojectnutrition.fit/api/delete",
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

      if (res.message === "subtracted Calories") {
        console.log("Response ", res.message);

        var user = {
          id: res.id,
        };

        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("subtracted Calories");
      } else {
        setMessage(res.message);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  async function handleGrabDailyInfo(day: string): Promise<void> {
    setCurrentDay(day);
  }

    const DaysOfWeek = () => {
      const [dailyCalories, setDailyCalories] = useState({
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
      });
    }

    // Fetch the user's daily calories data from the database/API
    const fetchCaloriesData = async () => {
      try {
        const response = await fetch('lp.largeprojectnutrition.fit/api/getUserCaloriesData'); // Replace with your actual API endpoint
        const data = await response.json();

        // Assuming the API returns caloriesData in this format
        const caloriesData = data.caloriesData || new Array(7).fill(0); // Fallback if data is missing

        // Map the array into an object with day names as keys
        const caloriesByDay = {
          Sunday: caloriesData[0],
          Monday: caloriesData[1],
          Tuesday: caloriesData[2],
          Wednesday: caloriesData[3],
          Thursday: caloriesData[4],
          Friday: caloriesData[5],
          Saturday: caloriesData[6],
        };

        setDailyCalories(caloriesByDay);
      } catch (error) {
        console.error('Error fetching calories data:', error);
      }
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
          {Object.entries(DaysofWeek).map(([day, calories]) => (
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
                Calorie Goal: <strong>{calorieGoal}</strong>
              </p>
              <p>
                Calorie Remaining: <strong>{caloriesRemaining}</strong>
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
                          <button id="AddButton" onClick={addCalories(food.foodId, day)}>
                            +
                          </button>
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
              <p>Food</p>

              <button className="addFoodButton" onClick={handleAddFoodClick}>
                + Add Food
              </button>
              <div className="list-foods">
                <ul>
                  {listOfFoods.map((food) => (
                    <li key={food.id}>
                      <strong>{food.description}</strong> | Brand:{" "}
                      {food.brandName} | Calories: {food.calories} | Protein:{" "}
                      {food.protein}g
                      <button
                        onClick={() => handleDeleteFood(food.id)}
                        style={{
                          marginLeft: "10px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Delete Item
                      </button>
                      <br />
                      <br />
                    </li>
                  ))}
                </ul>
              </div>
              {/* <button className="deleteFoodButton">- Delete Food</button> */}
            </div>
            {/* <div className="mealInput">
              <p>Lunch</p>
              <button className="addFoodButton" onClick={handleAddFoodClick}>
                + Add Food
              </button>
              <button className="deleteFoodButton">- Delete Food</button>
            </div> */}
          </div>
          {/* <div className="mealInputs">
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
          </div> */}
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
              {currentWeight} lbs
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
