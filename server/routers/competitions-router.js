/* globals require */
'use strict';

const express = require('express');

module.exports = ({ app, data, authentication, uploadCompetitionImage }) => {
    const controller = require('./../controllers/competitions-controller')(data),
        router = new express.Router();

    router
        .get('/', controller.loadCompetitions)
        .get('/create',authentication.isInRole('normal'),/* authentication.isInRole('organizator')*/controller.getCreatePage) // :id should be last
        .get('/:id', controller.getByID)
        .put('/:id/like', authentication.isAuthenticated, controller.likeCompetition)
        .put('/:id/dislike', authentication.isAuthenticated, controller.dislikeCompetition)
        .put('/:id/join', authentication.isAuthenticated, controller.joinCompetition)
        .put('/:id/leave', authentication.isAuthenticated, controller.leaveCompetition)

    // TODO
    // api/competiions/create
    .post('/create', uploadCompetitionImage.single('competitionImage'), controller.createCompetition);

    app.use('/competitions', router);
};