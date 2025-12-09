This folder is for Models.

Purpose:
Models define the structure of your data (schemas). If you are using a database like MongoDB (with Mongoose) or SQL (with Sequelize), your schema definitions go here.

Why use it?
It enforces data consistency and provides an interface to interact with your database.

Example:
// User.js (Mongoose example)
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: String,
    email: String
});
module.exports = mongoose.model('User', UserSchema);
