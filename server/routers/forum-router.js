/* globals require */
'use strict';

const express = require('express');

module.exports = ({ app, data,authentication }) => {
    const controller = require('./../controllers/forum-controller')(data),
        router = new express.Router();

    router
        .get('/', controller.loadForumPosts)
        .get('/create',  controller.getCreatePage)
        .post('/create', controller.createForumPost)
        .get('/:id', controller.getByID)
        .post('/:id/comment', authentication.isAuthenticated, controller.addComment)
        .put('/:id/like', authentication.isAuthenticated, controller.AddLikeToPost)
        .put('/:id/unlike', authentication.isAuthenticated, controller.UnlikePost)
        .put('/:id/comment/:answerid/like',authentication.isAuthenticated, controller.AddLikeToAnswer)
        .put('/:id/comment/:answerid/unlike', authentication.isAuthenticated, controller.UnlikePostAnswer)

    app.use('/forum', router);
};