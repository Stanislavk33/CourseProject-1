'use strict';

const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/home-controller')(data);

    const router = new express.Router();

    router.get('/', controller.getHome);

    app.use('/home', router);
};