/* globals module require */
'use strict';

module.exports = function(models, validator) {
    const ForumPost = models.ForumPost;

    return {
        getForumPosts({ page, pageSize }) {
            const skip = (page - 1) * pageSize,
                limit = pageSize;
            return new Promise((resolve, reject) => {
                ForumPost.find({}, {}, {
                    sort: { 'date': -1 },
                    skip,
                    limit
                }, (err, forumPosts) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(forumPosts);
                })
            })
        },
        getForumPostCount() {
            return new Promise((resolve, reject) => {
                ForumPost.count({}, (err, count) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(count);
                })
            })
        },
        getForumPostById(_id) {
            return new Promise((resolve, reject) => {
                ForumPost.findOne({ '_id': _id }, (err, forumPost) => {
                    if (err) {
                        return reject(err);
                    }
                    
                    if(!forumPost){
                        return resolve(null);
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
        createForumPost(forumPost) { 
            const newForumPost = new ForumPost({
                title: forumPost.title,
                description: forumPost.description,
                user: forumPost.user,
                date: new Date(),
                likes: 0,
                usersLiked: [],
                answers: []
            });

            return new Promise((resolve, reject) => {
                if (!validator.isValidForumPost(forumPost)) {
                    return reject({ error: "Invalid forum post information" });
                }
                newForumPost.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newForumPost);
                });
            });
        },
        addAnswerToForumPost(forumPostId, answer) {
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
        incrementForumPostLikes(_id) {
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
        decrementForumPostLikes(_id) {
            return new Promise((resolve, reject) => {
                ForumPost.findByIdAndUpdate({ '_id': _id, "score": { "$gt": 0 } }, { '$inc': { 'likes': -1 } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
            });
        },
        addUsernameToPostUsersLiked(postId, username) {
            return new Promise((resolve, reject) => {
                ForumPost.findByIdAndUpdate({ '_id': postId }, { $push: { 'usersLiked': username } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
            });
        },
        removeUsernameFromPostUsersLiked(postId, username) {
            return new Promise((resolve, reject) => {
                ForumPost.findByIdAndUpdate({ '_id': postId }, { $pull: { 'usersLiked': username } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
            });
        },
        // TODO: updateForumPostAnswerLikes()
        incrementForumPostAnswerLikes(_id, answerId) {
            return new Promise((resolve, reject) => {
                ForumPost.findOne({ '_id': _id })
                    .then((forumPost) => {
                        let answers = forumPost.answers;
                        answers.forEach(answer => {
                            if (answer._id == answerId) {
                                let likes = +answer.likes;
                                answer.likes = likes + 1;
                            }
                        });
                        return (answers)
                    }).then((updatedAnswers) => {
                        ForumPost.findOneAndUpdate({ '_id': _id }, { 'answers': updatedAnswers })
                            .then((done) => {
                                resolve(done);
                            }).catch(err => reject(err));
                    });
            });
        },
        decrementForumPostAnswerLikes(_id, answerId) {

            return new Promise((resolve, reject) => {
                ForumPost.findOne({ '_id': _id })
                    .then((forumPost) => {
                        let answers = forumPost.answers;
                        answers.forEach(answer => {
                            if (answer._id == answerId) {
                                let likes = +answer.likes;
                                answer.likes = likes - 1;
                            }
                        });
                        return (answers)
                    }).then((updatedAnswers) => {
                        ForumPost.findOneAndUpdate({ '_id': _id }, { 'answers': updatedAnswers })
                            .then((done) => {
                                resolve(done);
                            }).catch(err => reject(err));
                    });
            });
        },
        addUsernameToPostAnswerUsersLiked(postId, answerId, username) {
            return new Promise((resolve, reject) => {

                ForumPost.findOne({ '_id': postId })
                    .then((forumPost) => {
                        let answers = forumPost.answers;
                        answers.forEach(answer => {
                            if (answer._id == answerId) {
                                let usersLiked = answer.usersLiked;
                                usersLiked.push(username);
                            }
                        });
                        return (answers)
                    }).then((updatedAnswers) => {
                        ForumPost.findOneAndUpdate({ '_id': postId }, { 'answers': updatedAnswers })
                            .then((done) => {
                                resolve(done);
                            }).catch(err => reject(err));
                    });
            });
        },
        removeUsernameFromPostAnswerUsersLiked(postId, answerId, username) {
            return new Promise((resolve, reject) => {
                ForumPost.findOne({ '_id': postId })
                    .then((forumPost) => {
                        let answers = forumPost.answers;
                        answers.forEach(answer => {
                            if (answer._id == answerId) {
                                let usersLiked = answer.usersLiked;
                                usersLiked.pull(username);
                            }
                        });
                        return (answers)
                    }).then((updatedAnswers) => {
                        ForumPost.findOneAndUpdate({ '_id': postId }, { 'answers': updatedAnswers })
                            .then((done) => {
                                resolve(done);
                            }).catch(err => reject(err));
                    });
            });
        }
    };
};