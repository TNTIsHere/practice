const User = require("../models/User");
const Blog = require("../models/Blog")
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("../middleware/authMiddleware");
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
// Adding a blog
module.exports.addblog_post = [requireAuth, async (req, res) => {
    const { title, snippet, body } = req.body;
    try {
        const blog = await Blog.create({ title, snippet, body })
        res.status(201).json({blog: blog._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}];

// Deleting a blog
module.exports.deleteblog_delete = [requireAuth, async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Blog.findByIdAndDelete(id);
        res.json({ redirect: "/blogs" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "The developer sucks" })
    }
}];

// Updating a blog
module.exports.updateblog_post = [requireAuth, async (req, res) => {
    const { title, snippet, body, id } = req.body;

    try {
        const result = await Blog.findByIdAndUpdate(id, { title, snippet, body });
        res.status(200).json({response:"i love men"});
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "the dev actually sucks" })
    }
}];

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
};

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
};

// Logout function for website
module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.cookie("isAdmin", "", { maxAge: 1 });
    res.redirect("/");
};