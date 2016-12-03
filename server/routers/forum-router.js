/* globals require */
'use strict';

module.exports = ({ app, controllers, data,authentication }) => {
    const controller = controllers.forum;

        app.get('/forum/', controller.loadForumPosts);
        app.get('/forum/create',  controller.getCreatePage);
        app.post('/forum/create', controller.createForumPost);
        app.get('/forum/:id', controller.getByID);
        app.post('/forum/:id/comment', authentication.isAuthenticated, controller.addComment);
        app.put('/forum/:id/like', authentication.isAuthenticated, controller.AddLikeToPost);
        app.put('/forum/:id/unlike', authentication.isAuthenticated, controller.UnlikePost);
        app.put('/forum/:id/comment/:answerid/like',authentication.isAuthenticated, controller.AddLikeToAnswer);
        app.put('/forum/:id/comment/:answerid/unlike', authentication.isAuthenticated, controller.UnlikePostAnswer);
};