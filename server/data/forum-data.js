/* globals module require */
'use strict';

module.exports = function (models) {
    const ForumPost = models.ForumPost;

    return {
        getForumPosts({ page, pageSize }) {
            const skip = (page - 1) * pageSize,
                limit = pageSize;

            return Promise.all([
                new Promise((resolve, reject) => {
                    ForumPost.find()
                        .skip(skip)
                        .limit(limit)
                        .exec((err, forumPosts) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(forumPosts);
                        });
                }),
                new Promise((resolve, reject) => {
                    ForumPost.count({})
                        .exec((err, count) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(count);
                        })
                })
            ])
                .then(results => {
                    const [forumPosts, count] = results;

                    return { forumPosts, count };
                })

            // return new Promise((resolve, reject) => {
            //     ForumPost.find((err, forumPosts) => {
            //         if (err) {
            //             return reject(err);
            //         }

            //         return resolve(forumPosts);
            //     });
            // })
        },
        getForumPostById(_id) {
            return new Promise((resolve, reject) => {
                ForumPost.findOne({ '_id': _id }, (err, forumPost) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(forumPost);
                });
            })
        },
        getForumPostsByAuthor(username) {
            return new Promise((resolve, reject) => {
                ForumPost.find({ 'user.username': username }, (err, forumPosts) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(forumPosts);
                });
            })
        },
        createForumPost(forumPost) { //forum post object is created in the controller
            const newForumPost = new ForumPost({
                title: forumPost.title,
                description: forumPost.description,
                user: forumPost.user,
                date: new Date(),
                likes: 0,
                answers: []
            });

            return new Promise((resolve, reject) => {
                newForumPost.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newForumPost);
                });
            });
        },
        addAnswerToForumPost(forumPostId, answer) { //answer object is created in the controller
            answer.date = new Date();
            answer.likes = 0;
            return new Promise((resolve, reject) => {
                ForumPost.findByIdAndUpdate({ '_id': forumPostId }, { $push: { 'answers': answer } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    })
            });
        },
        updateForumPostLikes(_id) { //increment likes with 1
            return new Promise((resolve, reject) => {
                ForumPost.findByIdAndUpdate({ '_id': _id }, { '$inc': { 'likes': 1 } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
            });
        },
        // TODO: updateForumPostAnswerLikes()
    };
};