/* globals module require */
'use strict';

module.exports = function(models, validator) {
    const Competition = models.Competition;

    return {
        getAllCompetitions(page, size) {
            const skip = (page - 1) * size,
                limit = size;

            return new Promise((resolve, reject) => {
                Competition.find({}, {}, {
                    skip,
                    limit,
                    sort: {
                        likes: -1 //Sort by Date Added DESC
                    }
                }, function(err, competition) {
                    if (err) {
                        return reject(err);
                    };

                    return resolve(competition);
                });
            });
        },
        getCompetitionById(id) {
            return new Promise((resolve, reject) => {
                Competition.findOne({ _id: id }, (err, competition) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!competition) {
                        return resolve(null);
                    }

                    return resolve(competition);
                });
            });
        },
        createCompetition(competition) {
            const newCompetition = new Competition({
                name: competition.name,
                place: competition.place,
                description: competition.description,
                likes: 0,
                organizator: competition.organizator,
                category: competition.category,
                joinedUsers: [],
                points: competition.points,
                level: competition.level,
                startDate: competition.startDate,
                endDate: competition.endDate,
                image: competition.image,
                location: competition.location
            });

            return new Promise((resolve, reject) => {
                if (!validator.validateCompetition(competition)) {
                    return reject({ err: 'competition validation failed' })
                }
                newCompetition.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newCompetition);
                });
            });
        },
        updateCompetition(competitionId, update, options) {
            return new Promise((resolve, reject) => {
                Competition.findOneAndUpdate({ "_id": competitionId }, update, options,
                    (err, competition) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(competition);
                    });
            });
        },
        addJoinedUserToCompetition(competitionId, username) {
            return new Promise((resolve, reject) => {
                const conditions = {
                    _id: competitionId,
                    'joinedUsers.username': { $ne: username }
                }
                Competition.findOneAndUpdate(conditions, { $addToSet: { 'joinedUsers': { username, attended: false } } },
                    (err, competition) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(competition);
                    })
            });
        },
        removeUserFromCompetition(competitionId, username) {
            return new Promise((resolve, reject) => {
                Competition.update({ _id: competitionId }, { $pull: { "joinedUsers": { username } } }, (err, competition) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(competition);
                });
            });
        },
        updateCompetitionPassedStatus(_id, status) {
            return new Promise((resolve, reject) => {
                Competition.findByIdAndUpdate({ '_id': _id }, { $set: { 'passed': status } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
            });
        },
        getLatestUpcommingCompetitions() {
            return new Promise((resolve, reject) => {
                Competition.find({ startDate: { $gt: Date.now() } }, {}, { sort: { startDate: 1 } }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(competitions)
                    return resolve(competitions);
                })
            })
        },
        filterCompetitions(searchName) {
            return new Promise((resolve, reject) => {
                // findOne({'username' : {$regex : '.*son.*'}});
                const regex = { $regex: new RegExp(`.*${searchName}.*`, 'i') };
                const nameRegex = { name: regex };
                const placeRegex = { place: regex };
                const categoryRegex = { category: regex };

                Competition.find({ $or: [nameRegex, placeRegex, categoryRegex] }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            });
        },
        getMostPopularCompetitions() {
            return new Promise((resolve, reject) => {
                const competitions = Competition.find({})
                    .sort({ 'likes': 'desc' })
                    .limit(5);

                resolve(competitions);
            });
        },
        updateAttendedStatusToUser(username, competitionId) {
            return new Promise((resolve, reject) => {

                Competition.findById({ '_id': competitionId })
                    .then((competition) => {
                        let joinedUsers = competition.joinedUsers;
                        joinedUsers.forEach(user => {
                            if (user.username === username) {
                                user.attended = true;
                            }
                        });

                        return (joinedUsers);
                    }).then((joined) => {
                        Competition.findByIdAndUpdate({ '_id': competitionId }, { 'joinedUsers': joined })
                            .then((done) => {
                                resolve(done);
                            }).catch(er => reject(er));
                    });
            })
        },

        getCompetitionsCount() {
            return new Promise((resolve, reject) => {
                Competition.count({}, (err, count) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(count);
                })
            })
        }
    };
};