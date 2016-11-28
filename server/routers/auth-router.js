const express = require('express');

const multer = require('multer');
const upload = multer({ dest: './public/imgs/user-images/' });

module.exports = (app, data) => {
    const controller = require('./../controllers/auth-controller')(data);

    const router = new express.Router();

    router
        .get('/register', controller.loadRegisterPage)
        .post('/register', upload.single('avatar'), controller.register)
        .get('/login', controller.loadLoginPage)
        .post('/login', controller.loginLocal)
        .get('/logout', controller.logout)

    app.use('/auth', router);
}