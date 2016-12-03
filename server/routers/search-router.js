'use strict';

module.exports = ({ app, data, controllers }) => {
    const controller = controllers.search;

    app.get('/search/', controller.search);
};