'use strict';

const express = require('express'),
    multer = require('multer'),
    upload = multer({ dest: './public/imgs/user-images/' });

module.exports = ({ app, data, authentication }) => {
    const controller = require('./../controllers/user-controller')(data);

    const router = new express.Router();

    router
        .get('/', controller.loadUsers)
        .get('/:username', controller.getProfile)
        .get('/:username/edit', authentication.isSameUser, controller.getEditPage)
        .post('/:username/edit', authentication.isSameUser, upload.single('avatar'), controller.editProfile)
        .put('/addPoints', authentication.isInRole('organizator'), /*authentication.isInRole('organizator')*/ controller.addPoints)
        //- .get('/profile/:id', controller.getById);

    app.use('/users', router);
};