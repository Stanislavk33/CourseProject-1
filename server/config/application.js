/* globals require module */

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

let app = express();

app.set("view engine", "pug");
app.set("views", "./server/views");

app.use("static", express.static("public"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;