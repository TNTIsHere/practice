const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

// Check if JWT is valid, otherwise redirect
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWTsecret, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            }
            else {
                next();
            }
        })
    }
    else {
        res.redirect("/login");
    }
};

// Check who is logged in
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWTsecret, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };