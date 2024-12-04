const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const MongoDBSession = require('connect-mongodb-session')(session);
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const { ObjectId } = require('mongodb');
const url = 'mongodb+srv://largeproject:largeproject@cluster0.go0gv.mongodb.net/LPN?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
client.connect();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://largeproject:largeproject@cluster0.go0gv.mongodb.net/LPN?retryWrites=true&w=majority&appName=Cluster0';

const PORT = 5000; // Use dynamic port or fallback to 5000 for local dev

const store = new MongoDBSession({
    uri: mongoURI,
    collection: 'mySessions'
});

// Middleware
app.use(session({
    secret: 'Key that will sign our cookie that is saved in our browser',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.get("/", (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    res.send("Hello Session");
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect('/api/login');
    }
};

// Create account API
app.post('/api/createaccount', async (req, res, next) => {
    // incoming: firstName, lastName, username, password
    // outgoing: error
    //req.body
    const { firstName, lastName, userName, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !userName || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    let existingUser = await client.db("LPN").collection("Users").findOne({ Username: userName });

    if (existingUser) {
        return res.status(400).json({ message: 'Username taken' });
    }

    var error = '';
    try {
        const db = client.db("LPN");

        // Hash the password so that we store the hash password in our database
        const hashedPsw = await bcrypt.hash(password, 12);

        const newUser = { FirstName: firstName, LastName: lastName, Username: userName, Password: hashedPsw };

        const insertResult = await db.collection('Users').insertOne(newUser);
        const result = await db.collection('Users').findOne({ _id: insertResult.insertedId });

        const _id = insertResult.insertedId;
        const objectId = new ObjectId(_id);
        const objectIdString = objectId.toString();
        console.log(objectIdString);
        const addId = await db.collection('Users').findOneAndUpdate({ _id: insertResult.insertedId }, { $set: { id: objectIdString } }, { returnDocument: 'after' });

        if (result) {

            // const addId = await db.collection('Users').findOneAndUpdate({ Username: username }, { $set: { id: objectId } });
            console.log("This is the id :" + addId.id);
            const ret = {
                firstName: result.FirstName,
                lastName: result.LastName,
                userName: result.Username,
                id: addId.id,
                message: "Account Created"
            };
            return res.status(200).json(ret);
        } else {
            return res.status(500).json({ message: 'Server Error', error: 'No document found' });
        }
    } catch (e) {
        error = e.toString();
        console.error(e);
        return res.status(500).json({ message: 'Server Error', error: error });
    }
});

// Complete profile info API
app.post('/api/completeprofile', async (req, res, next) => {
    // incoming: userId, Age, Gender, Height, Weight, Email
    // outgoing: error
    const { Age, Gender, Height, Weight, Email, id, GoalWeight } = req.body;
    const newInfo = { Age: Age, Gender: Gender, Height: Height, Weight: Weight, Email: Email, GoalWeight: GoalWeight };
    console.log(GoalWeight);
    var error = '';
    // console.log(id);
    console.log("This is the id " + req.body.id);


    // Validate input
    if (!Age || !Gender || !Height || !Weight || !Email || !GoalWeight) {
        return res.status(400).json({ error: "Missing required fields" });
    }


    try {
        const db = client.db("LPN");
        const result = await db.collection('Users').updateOne(
            { id: req.body.id },
            { $set: newInfo },
        );

        console.log("This is the result object : " + result);

        if (result) {
            const ret = {
                Age: result.Age,
                Gender: result.Gender,
                Height: result.Height,
                Weight: result.Weight,
                Email: result.Email,
                GoalWeight: result.GoalWeight,
                id: result.id,
                message: "Profile Updated"
            };
            return res.status(200).json(ret);
        } else {
            return res.status(500).json({ message: 'Server Error', error: 'No document found' });
        }
    } catch (e) {
        error = e.toString();
        console.error(e);
        return res.status(500).json({ message: 'Server Error', error: error });
    }
});

//Get User Info API
app.post('/api/updateUserInfo', async (req, res, next) => {
    // incoming: id
    // outgoing: id

    var error = '';

    const { id, FirstName, LastName, UserName, Gender, Age, Height, Weight, Email } = req.body;

    console.log(id + ", " + FirstName + ", " + LastName + ", " + UserName
        + ", " + Gender + ", " + Age + ", " + Height + ", " + Weight + "," + Email);

    //Check if all fields have a value
    if (!id || !FirstName || !LastName || !UserName || !Gender || !Age || !Weight || !Email || !Height) {
        return res.status(400).json({ message: "One of the fields weren't found" });
    }

    try {
        const db = client.db("LPN");

        // Get the user credentials from the database
        const getDocument = await db.collection('Users').findOneAndUpdate({ id: req.body.id },
            {
                $set: {
                    FirstName: req.body.FirstName, LastName: req.body.LastName,
                    Username: req.body.UserName, Gender: req.body.Gender, Age: req.body.Age, Weight: req.body.Weight, Email: req.body.Email
                }
            },
            { returnDocument: 'after' });

        if (!getDocument) {
            return res.status(400).json({ message: "No document was found" });
        }
        else {
            ret = {
                id: getDocument.id,
                FirstName: getDocument.FirstName,
                LastName: getDocument.LastName,
                UserName: getDocument.Username,
                Age: getDocument.Age,
                Email: getDocument.Email,
                Gender: getDocument.Gender,
                Height: getDocument.Height,
                Weight: getDocument.Weight,
                message: "Updated User"
            }

            return res.status(200).json(ret);
        }

    } catch (e) {
        error = e.toString();
        console.error(e);
        console.log("error");
        return res.status(500).json({ message: "Server error occurred.", error: e.toString() });
    }
});


//Get goal weight for dashboard
app.post('/api/goalWeight', async (req, res, next) => {
    // incoming: id
    // outgoing: id

    var error = '';

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "id not found" });
    }

    try {
        const db = client.db("LPN");

        // Get the user credentials from the database
        const getDocument = await db.collection('Users').findOne({ id: req.body.id });

        if (!getDocument) {
            return res.status(400).json({ message: "Id was not found in database" });
        }
        else {
            ret = {
                id: getDocument.id,
                FirstName: getDocument.FirstName,
                LastName: getDocument.LastName,
                UserName: getDocument.Username,
                Age: getDocument.Age,
                Email: getDocument.Email,
                Gender: getDocument.Gender,
                Height: getDocument.Height,
                Weight: getDocument.Weight,
                GoalWeight: getDocument.GoalWeight,
                message: "Found"
            }

            return res.status(200).json(ret);
        }

    } catch (e) {
        error = e.toString();
        console.error(e);
        console.log("error");
        return res.status(500).json({ message: "Server error occurred.", error: e.toString() });
    }
});

//Get User Info API
app.post('/api/getUserInfo', async (req, res, next) => {
    // incoming: id
    // outgoing: id

    var error = '';

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "id not found" });
    }

    try {
        const db = client.db("LPN");

        // Get the user credentials from the database
        const getDocument = await db.collection('Users').findOne({ id: req.body.id });

        if (!getDocument) {
            return res.status(400).json({ message: "Id was not found in database" });
        }
        else {
            ret = {
                id: getDocument.id,
                FirstName: getDocument.FirstName,
                LastName: getDocument.LastName,
                UserName: getDocument.Username,
                Age: getDocument.Age,
                Email: getDocument.Email,
                Gender: getDocument.Gender,
                Height: getDocument.Height,
                Weight: getDocument.Weight,
                GoalWeight: getDocument.GoalWeight,
                message: "Found"
            }

            return res.status(200).json(ret);
        }

    } catch (e) {
        error = e.toString();
        console.error(e);
        console.log("error");
        return res.status(500).json({ message: "Server error occurred.", error: e.toString() });
    }
});

//Edit weight API
app.post('/api/editWeight', async (req, res, next) => {
    // incoming: currentWeight, id
    // outgoing: id

    var error = '';

    const { CurrentWeight, id } = req.body;

    if (!CurrentWeight || !id) {
        return res.status(400).json({ message: "Current weight or id not found" });
    }

    try {
        const db = client.db("LPN");

        // Get the user credentials from the database
        const getDocument = await db.collection('Users').findOne({ id: req.body.id });

        if (!getDocument) {
            return res.status(400).json({ message: "Id was not found in database" });
        }

        //Update the user's weight in the database
        const updateUserWeight = await db.collection('Users').
            findOneAndUpdate({ id: req.body.id }, { $set: { Weight: req.body.CurrentWeight } }, { returnDocument: 'after' });

        //Check if the User was updated
        if (updateUserWeight) {
            const ret = {
                id: getDocument.id,
                Weight: getDocument.Weight,
                message: "Updated Weight",
                error: ''
            };
            return res.status(200).json(ret);
        }
    } catch (e) {
        error = e.toString();
        console.error(e);
        return res.status(500).json({ message: "Server error occurred.", error: e.toString() });
    }
});




// Login API
app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';

    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const db = client.db("LPN");

        // Get the user credentials from the database
        const getDocument = await db.collection('Users').findOne({ Username: userName });

        if (!getDocument) {
            return res.status(400).json({ message: "Username and password is incorrect" });
        }

        // Get password from database
        const hashedPassword = getDocument.Password;

        // Check if password matches the hash password in our database
        const isMatch = await bcrypt.compare(password, hashedPassword);

        var id = -1;
        var fn = '';
        var ln = '';

        // If no match return
        if (!isMatch) {
            return res.status(400).json({ message: "Username or password is incorrect." });
        }

        const ret = {
            id: getDocument._id,
            firstName: getDocument.FirstName,
            lastName: getDocument.LastName,
            message: "Login Successful",
            error: ''
        };
        return res.status(200).json(ret);
    } catch (e) {
        error = e.toString();
        console.error(e);
        return res.status(500).json({ message: "Server error occurred.", error: e.toString() });
    }
});

// API for the USDA database
app.post('/api/search', async (req, res) => {
    // Incoming: query, pageSize
    // Outgoing: results[], error
    const {query} = req.body;
    console.log(query);

    const numOfResults = 10;
    let error = '';
    let results = [];

    if (!query || query.trim() === '') {
        return res.status(400).json({ results, error: 'Search cannot be empty.' });
    }

    try {
        // Make a request to the USDA API
        const usdaResponse = await axios.post(
            'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=NWgR0wlBc7YQOa8FcrSXGb3bPdXp9D0mE582U7SH',
            {
                query: query.trim(),
                pageSize: numOfResults
            }
        );

        // Extract the foods array from the response
        const usdaResults = usdaResponse.data.foods;

        // Process results to include desired fields
        const enrichedResults = usdaResults.map(food => ({
            description: food.description,
            brandName: food.brandName || null,
            calories: food.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value || 0,
            protein: food.foodNutrients?.find(n => n.nutrientName === 'Protein')?.value || 0,
            foodId: food.fdcId, // Correctly reference the food ID as fdcId
        }));

        // Limit results to the specified page size
        const limitedResults = enrichedResults.slice(0, numOfResults);
        console.log(limitedResults);

        // Return results
        res.status(200).json({ results: limitedResults, error: '' });
    } catch (err) {
        // Handle errors
        console.error(err);
        error = 'Failed to retrieve food data';
        res.status(500).json({ results, error });
    }
});

// API to add a selected food item to the user's profile
app.post('/api/add', async (req, res) => {
    const { id, foodId, day } = req.body;  // userId and foodId to identify the user and food item
    let error = '';

    if (!id || !foodId || !day) {
        return res.status(400).json({ error: 'User ID , Food ID , and day are required' });
    }

    try {
        // Get the selected food item details from the USDA API using foodId
        const foodResponse = await axios.get(
            `https://api.nal.usda.gov/fdc/v1/food/${foodId}?nutrients=203&nutrients=208&api_key=NWgR0wlBc7YQOa8FcrSXGb3bPdXp9D0mE582U7SH`
        );

        console.log(foodResponse.data);

        const foodItem = foodResponse.data;

        // Extract relevant food information
        const foodData = {
            description: foodItem.description,
            brandName: foodItem.brandName || null,
            calories: foodItem.foodNutrients.find(n => n.nutrient.name === "Energy")?.amount || 0,  // Access calories directly
            protein: foodItem.foodNutrients.find(n => n.nutrient.name === "Protein")?.amount || 0,   // Access protein directly
            foodId: foodItem.fdcId, // Store the food's unique fdcId
        };

        // Update the user's profile with the new food item
        const db = client.db("LPN");
        const User = await db.collection('Users').find({ id: req.body.id });

        // Check if the user exists
        if (!User) {
            return res.status(404).json({ error: 'User not found' });

        }

        // Initialize foodItems if it doesn't exist
        const foodItems = User.foodItems || [];

        // Add the food item to the user's foodItems array
        await db.collection('Users').updateOne(
            { id: req.body.id },
            { $push: { foodItems: foodData } }  // Add the food item to the user's foodItems array
        );

        // Update the user's calories for the specified day
        let updatedCaloriesData = User.caloriesData || {};
        const currentCalories = updatedCaloriesData[day] || 0;

        // Add the food item's calories to the current calories for the day
        updatedCaloriesData[day] = currentCalories + foodData.calories;

        // Save the updated calories data
        await db.collection('Users').updateOne(
            { id: req.body.id },
            { $set: { caloriesData: updatedCaloriesData } }
        );

        // Return success response with the updated food item and calories
        res.status(200).json({
            message: 'Food item added successfully and calories updated',
            foodItem: foodData,
            updatedCaloriesData: updatedCaloriesData,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add food item', details: err.message });
    }
});

// API for deleting a food
app.post('/api/delete', async (req, res) => {
    const { id, foodId } = req.body; // userId and foodId to identify the user and food item
    let error = '';

    if (!id || !foodId) {
        return res.status(400).json({ error: 'User ID and Food ID are required' });
    }

    try {
        const db = client.db("LPN");
        const User = await db.collection('Users').findOne({ id: req.body.id });

        // Check if the user exists
        if (!User) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the food item exists in the user's foodItems array
        /*const foodExists = User.foodItems.some(item => item.foodId === foodId);
        if (!foodExists) {
            return res.status(400).json({ error: 'Food item not found in user profile' });
        }*/

        // Remove the food item from the user's foodItems array
        await db.collection('Users').updateOne(
            { id: req.body.id },
            { $pull: { foodItems: { foodId: foodId } } }, // Remove the food item by foodId
        );

        // Update the user's calories for the specified day
        let updatedCaloriesData = User.caloriesData || {};
        const currentCalories = updatedCaloriesData[day] || 0;

        // Add the food item's calories to the current calories for the day
        updatedCaloriesData[day] = currentCalories + foodData.calories;

        // Save the updated calories data
        await db.collection('Users').updateOne(
            { id: req.body.id },
            { $set: { caloriesData: updatedCaloriesData } }
        );

        // Return success response with the updated food item and calories
        res.status(200).json({
            message: 'Food item deleted successfully and calories updated',
            foodItem: foodData,
            updatedCaloriesData: updatedCaloriesData,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete food item', details: err.message });
    }
});

app.listen(5000); // Start Node + Express server on port 5000