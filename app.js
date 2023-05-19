const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/authMiddleware");
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

const DBURL = `${process.env.DB_URL}`;
mongoose.connect(DBURL, { useNewUrlParser: true })
    .then((result) => app.listen(process.env.PORT))
    .then(console.log("DB connected"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.render("index"));
app.get("/blogs", requireAuth, (req, res) => res.render("blogs"));
app.use(authRoutes);