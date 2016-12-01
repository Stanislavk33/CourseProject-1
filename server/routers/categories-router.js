'use strict';

const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/categories-controller')(data),
        router = new express.Router();

    router
        .get('/', controller.loadCategories)
        .get('/:link', controller.getCategoryByTitle)

    app.use('/categories', router);
};