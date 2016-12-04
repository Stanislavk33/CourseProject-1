'use strict';

module.exports = ({ app, controllers }) => {
    const controller = controllers.search;

    app.get('/search/', controller.search);
};