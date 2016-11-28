/* globals require */
'use strict';

const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/forum-controller')(data),
        router = new express.Router();

    router
        .get('/', controller.loadForumPosts)
        .get('/create', /* is authenticated middleWare here */ controller.getCreatePage)
        .post('/create', controller.createForumPost)
        .get('/:id', controller.getByID)
        .post('/:id/comment', /* is authenticated middleWare here */ controller.addComment)
        .put('/:id/like', /* is authenticated middleWare here */ controller.AddLikeToPost)
        .put('/:id/comment/like', /* is authenticated middleWare here */ controller.addComment)

    app.use('/forum', router);
};