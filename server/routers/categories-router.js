'use strict';

const express = require('express'),
    multer = require('multer'),
    upload = multer({ dest: './public/imgs/categories-images/' });

module.exports = ({ app, data, authentication, uploadUserImage }) => {
    const controller = require('./../controllers/categories-controller')(data),
        router = new express.Router();

    router
        .get('/', controller.loadCategories)
        .get('/create', authentication.isInRole('normal') /*authentication.isInRole('admin')*/ , controller.getCreateCategory)
        .post('/create', authentication.isInRole('normal') /*authentication.isInRole('admin')*/ , upload.single('avatar'), controller.createCategory)
        .get('/:link', controller.getCategoryByTitle)

    app.use('/categories', router);
};