'use strict';

const express = require('express');

module.exports = ({ app, data, authentication, uploadUserImage }) => {
    const controller = require('./../controllers/categories-controller')(data),
        router = new express.Router();

    router
        .get('/', controller.loadCategories)
        .get('/:link', controller.getCategoryByTitle)
        .get('/create', authentication.isInRole('admin'), controller.getCreateCategory)
        .post('/create', authentication.isInRole('admin'), uploadUserImage.single('avatar'), controller.createCategory)

    app.use('/categories', router);
};