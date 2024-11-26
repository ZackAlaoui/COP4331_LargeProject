const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const MongoDBSession = require('connect-mongodb-session')(session);

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://largeproject:largeproject@cluster0.go0gv.mongodb.net/LPN?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
client.connect();

app.use(cors());
app.use(bodyParser.json());

//middleware
app.use(session({
    secret: 'Key that will sign our cookie that is saved in our browser',
    resave: false,
    saveUninitialized: false
}));

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

app.get("/", (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    res.send("Hello Session")
});

// create account API
app.post('/api/createaccount', async (req, res, next) => {
    // incoming: firstName, lastName, username, password
    // outgoing: error
    const { firstName, lastName, username, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    let existingUser = await client.db("LPN").collection("Users").findOne({ UserName: username });

    if (existingUser) {
        return res.status(400).json({ message: 'You already have an account' });
    }

    const newUser = { FirstName: firstName, LastName: lastName, Username: username, Password: password };
    var error = '';
    try {
        const db = client.db("LPN");

        //Hash the password so that we store the hash password in our database
        const hashedPsw = await bcrypt.hash(newUser.Password, 12);

        const insertResult = await db.collection('Users').insertOne(newUser);
        const result = await db.collection('Users').findOne({ _id: insertResult.insertedId });

        if (result) {
            req.session.username = username;
            const ret = {
                firstname: result.FirstName,
                lastname: result.LastName,
                username: result.Username,
                password: hashedPsw,
                message: "Account Created"
            };
            return res.status(200).json(ret);

        } else {
            return res.status(500).json({ message: 'Server Error', error: e.toString() });

        }
    }

    catch (e) {
        error = e.toString();
    }
});

app.post('/api/editinfo', async (req, res, next) => {


    // incoming: userId, Age, Gender, Height, Weight
    // outgoing: error
    const { age, gender, height, weight, email } = req.body;
    const newInfo = { Age: age, Gender: gender, Height: height, Weight: weight, Email: email };
    var error = '';

    if (!age || !gender || !height || !weight || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const db = client.db("LPN");
        //const results = await db.collection('Users').find({ "Card": { $regex: _search + '.*' } }).toArray();
    }
    catch (e) {
        error = e.toString();
    }

    infoList.push(info);
    var ret = { complete: complete, error: error };
    res.status(200).json(ret);
});

/*app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error
    const { userId, card } = req.body;
    const newCard = { Card: card, UserId: userId };
    var error = '';
    try {
        const db = client.db();
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
        error = e.toString();
    }
    cardList.push(card);
    var ret = { error: error };
    res.status(200).json(ret);
});*/

app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';

    const { username, password } = req.body;
    const db = client.db("LPN");

    const results = await
        db.collection('Users').find({ Username: username, Password: password }).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    if (results.length > 0) {
        id = results[0]._id;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

// api for the USDA database
const axios = require('axios');
const e = require('express');

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
        // Make a request to the USDA API https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1#/FDC/postFoodsSearch
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
                //fdcId: food.fdcId,
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



/* Search template
app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db();
    const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*' } }).toArray();
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].Card);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});
*/


app.listen(5000); // start Node + Express server on port 5000
