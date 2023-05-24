const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const Blog = require("./models/Blog");
require('dotenv').config();

const app = express();

// Use cookieparser and set the static view to "public"
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Ejs as middleware
app.set("view engine", "ejs");

// Connecting to DB
const DBURL = `${process.env.DB_URL}`;
mongoose.connect(DBURL, { useNewUrlParser: true })
    .then((result) => app.listen(process.env.PORT))
    .then(console.log("DB connected"))
    .catch((err) => console.log(err));

// Standard routes
app.get("*", checkUser);

app.get("/", (req, res) => res.render("index"))

app.get("/blogs", requireAuth, (req, res) => {
    Blog.find()
    .sort({ _id: -1 })
    .limit(4)
    .then((blogs) => {
        res.render("blogs", { blogs });
    })
    .catch((error) => {
        console.error("Error fetching documents", error);
        res.render("blogs", { blogs: [] });
    })
});

app.get("/adminsecret", requireAuth, (req, res) => res.render("adminsecret"))
app.use(authRoutes);