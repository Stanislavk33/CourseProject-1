/* globals require */
"use strict";

const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/competitions-controller')(data);

    const router = new express.Router();

    router
        .get('/', controller.loadCompetitions)
        .get('/:id', controller.getByID)
        .get('/create', controller.getCreatePage)

    .put('/:id/like', controller.likes)
        .put('/:id/join', controller.joinCompetition)

    .post('/create', controller.createCompetition);

    app.use('/competitions', router);
};