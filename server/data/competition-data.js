/* globals module require */
'use strict';

module.exports = function(models) {
    const Competition = models.Competition;

    return {
        getAllCompetitions() {
            return new Promise((resolve, reject) => {
                Competition.find((err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            });
        },
        getCompetitionById(id) {
            return new Promise((resolve, reject) => {
                Competition.findOne({ _id: id }, (err, competition) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(competition);
                });
            });
        },
        getCompetitionsByPlace(place) {
            return new Promise((resolve, reject) => {
                Competition.find({ 'place': place }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            })
        },
        getCompetitionsByOrganizator(username) {
            return new Promise((resolve, reject) => {
                Competition.find({ 'organizator.username': username }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            })
        },
        getCompetitionsByLevel(level) {
            return new Promise((resolve, reject) => {
                Competition.find({ 'level': level }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            })
        },
        createCompetition(competition) {
            // const passed = extractPassed(competition.startDate, competition.endDate);
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
                const competitions = Competition.find({ passed: 'upcoming' })
                    // .sort({ dateCreated: -1 })
                    .sort({ 'startDate': 'asc' })
                    .limit(5);

                resolve(competitions);
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
        getMostPopularCompetitions(count) {
            return new Promise((resolve, reject) => {
                const competitions = Competition.find({})
                    // .sort({ dateCreated: -1 })
                    .sort({ 'likes': 'desc' })
                    .limit(count);

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
        }
    };
};

function extractPassed(startDate, endDate) {
    if (+Date.now() > +new Date(endDate)) {
        return 'passed';
    } else if (+new Date(startDate) < +Date.now() &&
        +Date.now() < +new Date(endDate)) {
        return 'ongoing';
    } else {
        return 'upcoming';
    };
}