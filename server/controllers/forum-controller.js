'use strict';

const DEFAULT_PAGE = 1,
    PAGE_SIZE = 2; // for testing. Default will be 10/15

module.exports = (data) => {
    return {
        loadForumPosts(req, res) {
            const page = Number(req.query.page || DEFAULT_PAGE);

            data.getForumPosts({ page, pageSize: PAGE_SIZE })
                .then((result) => {

                    const { forumPosts, count } = result;

                    if (count === 0) {
                        return res.render('forum-page', {
                            result: { forumPosts, params: { page, pages: 0 }, user: req.user }
                        });
                    }

                    if (page < 1) {
                        return res.redirect('/forum?page=1');
                    }

                    let pages = (count / PAGE_SIZE) | 0;

                    if (count % PAGE_SIZE !== 0) {
                        pages += 1;
                    }

                    // if (parseInt(pages, 10) < pages) {
                    //     pages = parseInt(pages, 10);
                    //     pages += 1;
                    // }


                    if (page > pages) {
                        page = pages;

                        return res.redirect(`/forum?page=${page}`);
                    }

                    const user = req.user;

                    return res.status(200).render('forum-page', {
                        result: { forumPosts, user: req.user, params: { page, pages } }
                    });
                })
                .catch(err => { res.status(404).send(err); });
        },
        getCreatePage(req, res) {
            return res.status(200).render('create-forum-post', { result: { user: req.user } });
        },
        createForumPost(req, res) {
            const body = req.body,
                user = req.user;

            data.createForumPost({
                title: body.title,
                description: body.description,
                user: { username: user.username, points: user.progress.totalPoints}
            })
                .then(() => {
                    res.redirect('/forum')
                }).catch(err => {
                    console.log(err);
                });
        },
        getByID(req, res) { //
            const id = req.params.id;
            const currentUser = req.user;
            data.getForumPostById(id)
                .then(forumPost => {
                    res.render('forum-post-page', { result: { forumPost, currentUser, user: req.user } });
                });
        },
        addComment(req, res) { //
            const body = req.body,
                user = req.user,
                id = req.params.id;

            data.addAnswerToForumPost(id, {
                    content: body.content,
                    user: { username: req.user.username, points: req.user.progress.totalPoints }
                })
                .then(() => {
                    res.redirect('/forum/' + id)
                }).catch(err => {
                    console.log(err);
                });
        },
        AddLikeToPost(req, res) {
            const id = req.params.id;

            data.incrementForumPostLikes(id)
                .then(() => data.addUsernameToPostUsersLiked(id, req.user.username))
                .then(() => {
                    res.send('');
                }).catch(err => {
                    console.log(err);
                });
        },
        UnlikePost(req, res) {
            const id = req.params.id;

            data.decrementForumPostLikes(id)
                .then(() => data.removeUsernameFromPostUsersLiked(id, req.user.username))
                .then(() => {
                    res.send('');
                }).catch(err => {
                    console.log(err);
                });
        },
        AddLikeToAnswer(req, res) {
            const postId = req.params.id;
            const answerId = req.params.answerid;
            data.incrementForumPostAnswerLikes(postId, answerId)
                .then(() => data.addUsernameToPostAnswerUsersLiked(postId, answerId, req.user.username))
                .then(() => {
                    res.send('');
                }).catch(err => {
                    console.log(err);
                });
        },
        UnlikePostAnswer(req, res) {
            const postId = req.params.id;
            const answerId = req.params.answerid;
            data.decrementForumPostAnswerLikes(postId, answerId)
                .then(() => data.removeUsernameFromPostAnswerUsersLiked(postId, answerId, req.user.username))
                .then(() => {
                    res.send('');
                }).catch(err => {
                    console.log(err);
                });
        }
    };
};