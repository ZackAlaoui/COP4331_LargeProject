const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://largeproject:largeproject@cluster0.go0gv.mongodb.net/LPN?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);
client.connect();

app.use(cors());
app.use(bodyParser.json());

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

// create account API
app.post('/api/createaccount', async (req, res, next) => {
    // incoming: firstName, lastName, username, password
    // outgoing: error
    const { firstName, lastName, username, password} = req.body;
    
    // Validate input
    if (!firstName || !lastName || !username || !password ) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const User = { FirstName: firstName, LastName: lastName, Username: username, Password: password};
    var error = '';
    try {
        const db = client.db("LPN");
        const result = db.collection('Users').insertOne(User);
    }
    catch (e) {
        error = e.toString();
    }

    var complete = 'user added'

    var ret = { complete: complete, error: error };
    res.status(200).json(ret);
});

app.post('/api/editinfo', async (req, res, next) => {
    // incoming: userId, Age, Gender, Height, Weight
    // outgoing: error
    const { userId, Age, Gender, Height, Weight } = req.body;
    const newInfo = { UserId: userId, Age: Age, Gender: Gender, Height: Height, Weight: Weight };
    var error = '';
    try {
        const db = client.db("LPN");
        const result = db.collection('Info').insertOne(newInfo);
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

        // Extract food descriptions and FDC IDs from the response
        results = usdaResponse.data.foods.map(food => ({
            description: food.description,
            fdcId: food.fdcId,
           // calories: food.calories,
            //protein: food.protein,
            
        }));

        // Return results
        res.status(200).json({ results, error });
    } catch (err) {
        // Handle errors
        error = 'Error occurred while fetching data from the USDA API.';
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
