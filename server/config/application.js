/* globals require module */

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();

app.set('view engine', 'pug');
app.set('views', './server/views');

app.use('/static', express.static(path.resolve(__dirname + '/../../public')));
console.log(path.resolve(__dirname + '/../../public'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'james bond 007' }));


module.exports = app;