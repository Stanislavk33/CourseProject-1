'use strict';

module.exports = ({ app, controllers }) => {
    const controller = controllers.home;

    app.get('/', controller.getHome);
    app.get('/home', controller.getHome);
};