const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes")
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "ejs");

const DBURL = `${process.env.DB_URL}`;
mongoose.connect(DBURL, { useNewUrlParser: true })
    .then((result) => app.listen(process.env.PORT))
    .then(console.log("DB connected"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.use(authRoutes);