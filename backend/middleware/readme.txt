This folder is for Middleware.

Purpose:
Middleware functions run *before* your controller logic. They are perfect for tasks that need to happen for many different routes, like checking if a user is logged in, validating input data, or logging requests.

Why use it?
It prevents code duplication. You write the check once and apply it to any route that needs it.

Example:
// authMiddleware.js
module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send("Unauthorized");
    }
    next(); // Proceed to the next step (the controller)
};
