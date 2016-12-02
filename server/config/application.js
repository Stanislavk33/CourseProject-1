/* globals require module */
'use strict';

const express = require('express'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express();

app.set('view engine', 'pug');
app.set('views', './server/views');

app.use('/static', express.static(path.resolve(__dirname + '/../../public')));
console.log(path.resolve(__dirname + '/../../public'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'james bond 007', resave: true, saveUninitialized: true }));


module.exports = app;