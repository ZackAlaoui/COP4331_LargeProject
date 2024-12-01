const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


const UsersSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Age: { type: Number, required: true },
    Gender: { type: String, required: true },
    Height: { type: Number, required: true },
    Weight: { type: Number, required: true },
    Email: { type: String, required: true, unique: true },
});

const Users = mongoose.model('User', UsersSchema);

module.exports = Users;
