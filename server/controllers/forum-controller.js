'use strict';

const DEFAULT_PAGE = 1,
    PAGE_SIZE = 3; // for testing. Default will be 10/15

module.exports = (data) => {
    return {
        loadForumPosts(req, res) {
            const page = Number(req.query.page || DEFAULT_PAGE);

            data.getForumPosts({ page, pageSize: PAGE_SIZE })
                .then((result => {

                    const {
                        forumPosts,
                        count
                    } = result;

                    if (count === 0) {

                        return res.render('forum-page', {
                            result: {
                                forumPosts,
                                params: {
                                    page,
                                    pages: 0
                                }
                            }
                        });
                    }

                    if (page < 1) {
                        return res.redirect('/forum?page=1');
                    }

                    const pages = count / PAGE_SIZE | 0;

                    if (parseInt(pages, 10) < pages) {
                        pages += 1;
                        pages = parseInt(pages, 10);
                    }


                    if (page > pages) {
                        page = pages;

                        return res.redirect(`/forum?page=${page}`);
                    }

                    return res.status(200).render('forum-page', {
                        result: {
                            forumPosts,
                            params: {
                                page,
                                pages
                            }
                        }
                    });
                    // return res.status(200).render('forum-page', { result: forumPosts });
                }))
                .catch(err => { res.status(404).send(err); });
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