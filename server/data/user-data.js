"use strict"

module.exports = function (models) {
    let User = models.User;

    return {
        getAllUsers() {
            return new Promise((resolve, reject) => {
                User.find((err, users) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(users);
                });
            })
        },
        getTopUsers() {
            return new Promise((resolve, reject) => {
                User.find({})
                    .sort({ "progress.totalPoints": "desc" })
                    .limit(10)
                    .exec((err, users) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(users);
                    })
            });
        },
        getUserById(id) {
            return new Promise((resolve, reject) => {
                User.findOne({ "_id": id }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            })
        },
        getUserByUsername(username, asPersonalPage) {
            return new Promise((resolve, reject) => {
                User.findOne({ "username": username }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    const joinedCompetitions = [];
                    const attendedCompetitions = [];

                    user.competitions.forEach(c => {
                        if (c.attended) {
                            attendedCompetitions.push(c);
                        } else if (asPersonalPage) {
                            joinedCompetitions.push(c);
                        }
                    });

                    user.attendedCompetitions = attendedCompetitions;
                    if (asPersonalPage) {
                        user.joinedCompetitions = joinedCompetitions;
                    }
                    return resolve(user);
                });
            });
        },
        createUser(user) { //user object is created in the controller
            let newUser = new User({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                passHash: user.passHash,
                birthDate: user.birthDate,
                email: user.email,
                competitions: [],
                progress: {
                    totalPoints: 0,
                    categoriesPoints: []
                },
                inRole: user.inRole
            });
            if (user.image) {
                newUser.image = user.image
            }

            return new Promise((resolve, reject) => {
                newUser.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newUser);
                });
            });
        },
        addCompetitionToUser(username, competition) { //competition object is created in the controller
            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({ "username": username }, { $push: { "competitions": competition } },
                    (err, user) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(user);
                    })
            });
        },
        removeCompetitionFromUser(username, competitionId) {
        },
        updateUserInRole(userId, role) {
            return new Promise((resolve, reject) => {
                User.findByIdAndUpdate({ "_id": userId }, { $set: { "inRole": role } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
            });
        },
        updateUserInformation(username, newInfo) {
            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({ username }, newInfo,
                    (err, user) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(err);
                    })
            });
        },
        updatePoints(username, points, category) {
            return new Promise((resolve, reject) => {
                let currentPoints = 0;
                let user = User.findOne({ username })
                    .then((user) => {
                        currentPoints = user.progress.totalPoints + points;
                        const categoryPoints = user.progress.categoriesPoints || [];
                        if (categoryPoints.length === 0 || !categoryPoints.map(x => x.name).includes(category)) {
                            categoryPoints.push({
                                name: category,
                                points
                            })
                        } else {
                            categoryPoints.forEach(el => {
                                if (el.name === category) {
                                    el.points += +points;
                                }

                            });
                        }
                        return { currentPoints, categoryPoints };
                    }).then(newPoints => {
                        User.findOneAndUpdate({ username }, { $set: { 'progress.totalPoints': newPoints.currentPoints, 'progress.categoriesPoints': newPoints.categoryPoints } },
                            (err, user) => {
                                if (err) {
                                    return reject(err);
                                }

                                return resolve(user);
                            })
                    });
            });
        }

    };
}