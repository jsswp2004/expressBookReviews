const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Use JSON middleware
app.use(express.json());

// Session middleware for customer routes
app.use("/customer", session({
    secret: process.env.SESSION_SECRET || "default_secret", // Use an environment variable for the secret
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret", (err, user) => { // Use an environment variable for JWT secret
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

// Set the port
const PORT = process.env.PORT || 5000;

// Route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
