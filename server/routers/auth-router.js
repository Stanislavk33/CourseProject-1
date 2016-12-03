'use strict';

module.exports = ({ app, data, controllers, authentication, uploadUserImage }) => {
    const controller = controllers.auth;

        app.get('/auth/register', controller.loadRegisterPage);
        app.post('/auth/register', uploadUserImage.single('avatar'), controller.register);
        app.get('/auth/login', controller.loadLoginPage);
        app.post('/auth/login', controller.loginLocal);
        app.get('/auth/logout', authentication.isAuthenticated, controller.logout);
        app.get('/auth/facebook', controller.facebookAuthenticate);
        app.get('/auth/facebook/callback', controller.loginUserFacebook);
}