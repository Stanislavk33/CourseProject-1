/* globals require */
'use strict';

module.exports = ({ app, controllers, authentication }) => {
    const controller = controllers.forum;

        app.get('/forum/', controller.loadForumPosts);
        app.get('/forum/create', authentication.isAuthenticated, controller.getCreatePage);
        app.post('/forum/create',authentication.isAuthenticated, controller.createForumPost);
        app.get('/forum/:id', controller.getByID);
        app.post('/forum/:id/comment', authentication.isAuthenticated, controller.addComment);
        app.put('/forum/:id/like', authentication.isAuthenticated, controller.addLikeToPost);
        app.put('/forum/:id/unlike', authentication.isAuthenticated, controller.unlikePost);
        app.put('/forum/:id/comment/:answerid/like',authentication.isAuthenticated, controller.addLikeToAnswer);
        app.put('/forum/:id/comment/:answerid/unlike', authentication.isAuthenticated, controller.unlikePostAnswer);
};