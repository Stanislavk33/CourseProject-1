/* globals require */
"use strict";

const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/forum-controller')(data);

    const router = new express.Router();

    router
        .get('/', controller.loadForumPosts)
        .get('/create', /* is authenticated middleWare here */ controller.getCreatePage)
        .post('/create', controller.createForumPost)
        .get('/:id', controller.getByID)
        .post('/:id/comment', /* is authenticated middleWare here */ controller.addComment)
        .put('/:id/like', controller.likes)

    app.use('/forum', router);
};