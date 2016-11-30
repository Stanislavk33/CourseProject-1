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
        .put('/:id/like', /* is authenticated middleWare here */ controller.likeCompetition)
        .put('/:id/dislike', /* is authenticated middleWare here */ controller.dislikeCompetition)
        .put('/:id/join', /* is authenticated middleWare here */ controller.joinCompetition)
        .put('/:id/leave', /* is authenticated middleWare here */ controller.leaveCompetition)

    // TODO
    // api/competiions/create
    .post('/create', controller.createCompetition);

    app.use('/competitions', router);
};