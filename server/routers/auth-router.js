'use strict';

const express = require('express'),
    multer = require('multer'),
    upload = multer({ dest: './public/imgs/user-images/' });

module.exports = (app, data) => {
    const controller = require('./../controllers/auth-controller')(data);

    const router = new express.Router();

    router
        .get('/register', controller.loadRegisterPage)
        .post('/register', upload.single('avatar'), controller.register)
        .get('/login', controller.loadLoginPage)
        .post('/login', controller.loginLocal)
        .get('/logout', controller.logout)
        .get("/facebook", controller.loginUserFacebook)
        .get("/facebook/callback", controller.loginUserFacebook);
    app.use('/auth', router);
}