'use strict';

const express = require('express');

module.exports = ({ app, data, authentication, uploadUserImage }) => {
    const controller = require('./../controllers/auth-controller')(data);

    const router = new express.Router();

    router
        .get('/register', controller.loadRegisterPage)
        .post('/register', uploadUserImage.single('avatar'), controller.register)
        .get('/login', controller.loadLoginPage)
        .post('/login', controller.loginLocal)
        .get('/logout', authentication.isAuthenticated, controller.logout)
        .get("/facebook", controller.loginUserFacebook)
        .get("/facebook/callback", controller.loginUserFacebook);
    app.use('/auth', router);
}