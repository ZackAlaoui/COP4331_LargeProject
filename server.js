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
    const { firstName, lastName, userName, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !userName || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    let existingUser = await client.db("LPN").collection("Users").findOne({ Username: userName });

    if (existingUser) {
        return res.status(400).json({ message: 'You already have an account' });
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

// Edit info API
app.post('/api/editinfo', async (req, res, next) => {
    // incoming: userId, Age, Gender, Height, Weight, Email
    // outgoing: error
    const { Age, Gender, Height, Weight, Email, id } = req.body;
    const newInfo = { Age: Age, Gender: Gender, Height: Height, Weight: Weight, Email: Email };
    var error = '';
    // console.log(id);
    console.log("This is the id " + req.body.id);


    // Validate input
    if (!Age || !Gender || !Height || !Weight || !Email) {
        return res.status(400).json({ error: "Missing required fields" });
    }


    try {
        const db = client.db("LPN");
        const result = await db.collection('Users').findOneAndUpdate(
            { id: req.body.id },
            { $set: newInfo },
            { returnDocument: 'after' }
        );

        console.log("This is the result object : " + result);

        if (result.value) {
            const insertInfo = result.value;
            const ret = {
                Age: insertInfo.Age,
                Gender: insertInfo.Gender,
                Height: insertInfo.Height,
                Weight: insertInfo.Weight,
                Email: insertInfo.Email,
                id: insertInfo.id,
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
app.post('/v1/foods/search', async (req, res) => {
    // incoming: query
    // outgoing: results[], error
    const { query } = req.body;

    let error = '';
    let results = [];

    if (!query || query.trim() === '') {
        res.status(400).json({ results, error: 'Search cannot be empty.' });
        return;
    }

    try {
        // Make a request to the USDA API
        const usdaResponse = await axios.post(
            'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=NWgR0wlBc7YQOa8FcrSXGb3bPdXp9D0mE582U7SH',
            { query: query.trim() }
        );

        const usdaResults = usdaResponse.data.foods;

        const enrichedResults = [];

        // Iterate over USDA results to fetch additional data
        for (const food of usdaResults) {
            // Example: Fetch additional data from another API
            const additionalDataResponse = await axios.get(
                `https://api.nal.usda.gov/fdc/v1/food/2038064?api_key=NWgR0wlBc7YQOa8FcrSXGb3bPdXp9D0mE582U7SH`,
                { query: query.trim() }
            );

            const additionalData = additionalDataResponse.data;

            // Extract food descriptions and FDC IDs from the response
            const results = {
                description: food.description,
                brandName: food.brandName || null,
                calories: food.foodNutrients.find(n => n.nutrientName === 'Energy').value,
                protein: food.foodNutrients.find(n => n.nutrientName === 'Protein').value
            };
            enrichedResults.push(results);
        }

        // Return results
        res.status(200).json({ results: enrichedResults, error: '' });
    } catch (err) {
        // Handle errors
        error = 'No results found';
        console.error(err);
        res.status(500).json({ results, error });
    }
});

app.listen(5000); // Start Node + Express server on port 5000