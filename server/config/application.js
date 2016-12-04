/* globals require module */
'use strict';

const express = require('express'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express();

const secretStrings = {
    production: process.env.SECRET_STRING,
    development: 'james bond 007'
};

app.set('view engine', 'pug');
app.set('views', './server/views');

app.use('/static', express.static(path.resolve(__dirname + '/../../public')));


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: secretStrings[process.env.NODE_ENV || "development"], resave: true, saveUninitialized: true }));
//secret: read from file!

module.exports = app;