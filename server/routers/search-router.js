'use strict';

const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/search-controller')(data);

    const router = new express.Router();
    router.get('/', controller.search);


    app.use('/search', router);
};