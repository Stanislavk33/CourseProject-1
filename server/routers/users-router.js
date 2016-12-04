'use strict';

module.exports = ({ app, controllers, authentication, uploadUserImage }) => {
    const controller = controllers.user;

        app.get('/users/', controller.loadUsers);
        app.get('/users/:username', controller.getProfile);
        app.get('/users/:username/edit', authentication.isSameUser, controller.getEditPage);
        app.post('/users/:username/edit', authentication.isSameUser, uploadUserImage.single('avatar'), controller.editProfile);
        app.put('/users/addPoints', authentication.isInRole('organizator'), /*authentication.isInRole('organizator')*/ controller.addPoints);
        //- app.get('/users/profile/:id', controller.getById);
};