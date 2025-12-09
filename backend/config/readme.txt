This folder is for Configuration files.

Purpose:
Store configuration settings here, such as database connection logic, environment variable validation, or third-party service setups.

Why use it?
It isolates setup code from application logic, making it easier to manage settings and switch environments (dev/prod).

Example:
// db.js
const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
};
module.exports = connectDB;
