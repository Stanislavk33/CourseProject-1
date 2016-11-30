'use strict';

const express = require('express'),
    multer = require('multer'),
    upload = multer({ dest: './public/imgs/user-images/' });

module.exports = (app, data) => {
    const controller = require('./../controllers/user-controller')(data);

    const router = new express.Router();

    router
        .get('/', controller.loadUsers)
        .get('/:username', controller.getProfile)
        .get('/:username/edit', controller.getEditPage)
        .post('/:username/edit', upload.single('avatar'), controller.editProfile)
        .put('/addPoints', controller.addPoints)
        .get('/profile/:id', controller.getById);

    app.use('/users', router);
};