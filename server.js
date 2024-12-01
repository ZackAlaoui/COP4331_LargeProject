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
    // incoming: firstName, lastName, email, username, password, age, weight, gender, height
    // outgoing: error
    const { firstName, lastName, username, password, email, age, gender, height, weight } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !phoneNumber || !email || !age || !gender || !height || !weight) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    const User = { FirstName: firstName, LastName: lastName, Username: username, Password: password, Email: email, Age: age, Gender: gender, Height, height, Weight: weight};
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
    // incoming: userId, updateField(Age, Gender, Height, Weight), newValue
    // outgoing: success, error
    const { _id, updateFIeld, newVal } = req.body;
    var error = '';
    try {
        const db = client.db("LPN");
        const user = await db.collection('Users').findOne({ "id": userId });

        if (!user) {
            error = 'User not found';
            return res.status(404).json({ success: false, error });
        }

        // Update the document in the database
        const updateResult = await db.collection('Users').updateOne(
            { "_id": userId },
            { "Age": Age },
            { "Gender": Gender },
            { "Height": Height },
            { "Weight": Weight }
        );

        if (updateResult.modifiedCount === 0) {
            error = 'No changes made';
            return res.status(400).json({ success: false, error });
        }
    }
    catch (e) {
        error = e.toString();
    }

    var ret = { complete: complete, error: error };
    res.status(200).json(ret);
});

app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error
    const { userId, card } = req.body;
    const newCard = { Card: card, UserId: userId };
    var error = '';
    try {
        const db = client.db("LPN");
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
        error = e.toString();
    }
    cardList.push(card);
    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';

    const { login, password } = req.body;
    const db = client.db("LPN");

    const results = await
        db.collection('Users').find({ Login: login, Password: password }).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    if (results.length > 0) {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db("LPN");
    const results = await db.collection('Users').find({ "_id": { $regex: _search + '.*' } }).toArray();
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].Card);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});

app.listen(5000); // start Node + Express server on port 5000
