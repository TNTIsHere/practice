const User = require("../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Custom error handler
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: "", password: ""};

    if (err.message === "Incorrect Email") {
        errors.email = "That email does not exist";
    }

    if (err.message === "Incorrect Password") {
        errors.password = "That password is incorrect";
    }

    if (err.code === 11000) {
        errors.email = "That email is already in use";
        return errors;
    }

    if (err.message.includes("users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

// Create JWT token
const maxAge = 3 * 24 * 60 * 60;
const createJWT = (id) => {
    return jwt.sign({id}, process.env.JWTsecret, {
        expiresIn: maxAge
    });
}
// Get login/signup
module.exports.signup_get = (req, res) => {
    res.render("signup");
}

module.exports.login_get = (req, res) => {
    res.render("login");
}

// Signup function for website
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
         const user = await User.create({ email, password })
         const token = createJWT(user._id);
         res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
         res.status(201).json({user: user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

// Login function for website
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createJWT(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

// Logout function for website
module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
}