'use strict';

module.exports = (data) => {
    return {
        loadForumPosts(req, res) {
            data.getAllForumPosts()
                .then(forumPosts => {
                    return res.status(200).render('forum-page', { result: forumPosts });
                });
        },
        getCreatePage(req, res) {
            return res.status(200).render('create-forum-post');
        },
        createForumPost(req, res) {
            const body = req.body,
                user = req.user;

            data.createForumPost({
                title: body.title,
                description: body.description,
                user: { username: 'someusername', points: 0 } // TODO: get from req.user
            })
                .then(() => {
                    res.redirect('/forum')
                }).catch(err => {
                    console.log(err);
                });
        },
        getByID(req, res) { //
            const id = req.params.id;
            data.getForumPostById(id)
                .then(forumPost => {
                    res.render('forum-post-page', { result: forumPost });
                });
        },
        addComment(req, res) { //
            const body = req.body,
                user = req.user,
                id = req.params.id;

            data.addAnswerToForumPost(id, {
                content: body.content,
                user: { username: 'someusername', points: 0 } // TODO: get from req.user
            })
                .then(() => {
                    res.redirect('/forum/' + id)
                }).catch(err => {
                    console.log(err);
                });
        },
        AddLikeToPost(req, res) {
            const id = req.params.id;

            data.updateForumPostLikes(id)
                .then(() => {
                    res.redirect('/forum')
                }).catch(err => {
                    console.log(err);
                });
        },
        AddLikeToAnswer(req, res) { //
            // TODO 
        }
    };
};