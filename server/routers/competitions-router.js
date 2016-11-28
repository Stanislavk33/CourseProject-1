/* globals require */
'use strict';

const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/competitions-controller')(data),
        router = new express.Router();

    router
        .get('/', controller.loadCompetitions)
        .get('/create', controller.getCreatePage) // :id should be last
        .get('/:id', /* is authenticated and isInRole middleWare here */ controller.getByID)

        // .put('/:id/like', controller.likes)
        .put('/:id/join', controller.joinCompetition)
        .put('/:id/leave', controller.leaveCompetition)

        // TODO
        // api/competiions/create
        .post('/create', controller.createCompetition);

    app.use('/competitions', router);
};