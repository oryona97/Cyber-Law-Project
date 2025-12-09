This folder is for Controllers.

Purpose:
Controllers contain the actual "logic" for your API endpoints. They handle the incoming request (req), perform necessary operations (like fetching data from a database), and send back a response (res).

Why use it?
It keeps your 'routes' files clean. Instead of writing all the code inside the route definition, you import a function from here.

Example:
// authController.js
exports.login = (req, res) => {
    // Logic to verify user credentials
    res.send("Logged in!");
};
