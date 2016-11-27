/* globals module require */
"use strict";

module.exports = function(models) {
    let Competition = models.Competition;

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
                Competition.find({ "place": place }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            })
        },
        getCompetitionsByOrganizator(username) {
            return new Promise((resolve, reject) => {
                Competition.find({ "organizator.username": username }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            })
        },
        getCompetitionsByLevel(level) {
            return new Promise((resolve, reject) => {
                Competition.find({ "level": level }, (err, competitions) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(competitions);
                });
            })
        },
        createCompetition(competition) { //competition object is created in the controller
            const passed = extractPassed(competition.startDate, competition.endDate);
            let newCompetition = new Competition({
                place: competition.place,
                likes: 0,
                organizator: competition.organizator,
                category: competition.category,
                joinedUsers: [],
                points: competition.points,
                level: competition.level,
                keys: competition.keys,
                passed: passed,
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
        updateCompetitionLikes(_id) { //increment likes with 1
            return new Promise((resolve, reject) => {
                Competition.findByIdAndUpdate({ "_id": _id }, { "$inc": { "likes": 1 } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    })
            });
        },
        addJoinedUserToCompetition(competitionId, user) { //user object is created in the controller
            return new Promise((resolve, reject) => {
                Competition.findByIdAndUpdate({ "_id": competitionId }, { $push: { "joinedUsers": user } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    })
            });
        },
        updateCompetitionPassedStatus(_id, status) {
            return new Promise((resolve, reject) => {
                Competition.findByIdAndUpdate({ "_id": _id }, { $set: { "passed": status } },
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
                let competitions = Competition.find({ passed: "upcoming" })
                    // .sort({ dateCreated: -1 })
                    .sort({ 'startDate': 'asc' })
                    .limit(5);

                resolve(competitions);
            });
        },
        getMostPopularCompetitions(count) {
            return new Promise((resolve, reject) => {
                let competitions = Competition.find({})
                    // .sort({ dateCreated: -1 })
                    .sort({ 'likes': 'desc' })
                    .limit(count);

                resolve(competitions);
            });
        }
        // Not working
        // getCompetitionsByKeys(...keys) { 
        //     if (Array.isArray(keys[0])) {
        //         keys = keys[0];
        //     }
        //     console.log(keys);
        //     return new Promise((resolve, reject) => {
        //         Competition.find({ 
        //             "keys": keys
        //             })
        //         }, (err, competitions) => {
        //             if (err){
        //                 return reject(err);
        //             }

        //             return resolve(competitions);
        //             });
        //     },
    };
};

function extractPassed(startDate, endDate) {
    if (+Date.now() > +new Date(endDate)) {
        return "passed";
    } else if (+new Date(startDate) < +Date.now() &&
        +Date.now() < +new Date(endDate)) {
        return "ongoing";
    } else {
        return "upcoming";
    };
}