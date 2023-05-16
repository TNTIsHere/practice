const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

const dburi = "mongodb+srv://pawel:<password>@cluster.3flzstn.mongodb.net/?retryWrites=true&w=majority";