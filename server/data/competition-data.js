/* globals module require */
"use strict"

module.exports = function(models) {
    let Competition = models.Competition;

    return {
        getAllCompetitions() {
            return new Promise((resolve, reject) => {
                Competition.find((err, competitions) => {
                    if (err){
                        return reject(err);
                    }

                    return resolve (competitions);
                });
            })
        },
        getCompetitionById(id) {
            return new Promise((resolve, reject) => {
                Competition.find({ _id: id }, (err, competition) => {
                    if (err){
                        return reject(err);
                    }

                    return resolve(competition);
                });
            })
        },
        getCompetitionsByPlace(place) {
            return new Promise((resolve, reject) => {
                Competition.find({ "place": place }, (err, competitions) => {
                    if (err){
                        return reject(err);
                    }
                    
                    return resolve(competitions);
                });
            })
        },
        getCompetitionsByOrganizator(username) {
            return new Promise((resolve, reject) => {
                Competition.find({ "organizator.username": username }, (err, competitions) => {
                    if (err){
                        return reject(err);
                    }
                    
                    return resolve(competitions);
                });
            })
        },
        getCompetitionsByLevel(level) {
            return new Promise((resolve, reject) => {
                Competition.find({ "level": level }, (err, competitions) => {
                    if (err){
                        return reject(err);
                    }
                    
                    return resolve(competitions);
                });
            })
        },
        // Still not working, will fix soon
        // getCompetitionsByKeys(...keys) { 
        //     if (Array.isArray(keys[0])) {
        //         keys = keys[0];
        //     }

        //     return new Promise((resolve, reject) => {
        //         Competition.find({ 
        //             "keys": { 
        //                 $in: keys 
        //             }
        //         }, (err, competitions) => {
        //             if (err){
        //                 return reject(err);
        //             }
                    
        //             return resolve(competitions);
        //             });
        //     });
        // },
        createCompetition(competition) { //competition object is create in the controller
            let newCompetition = new Competition({
                place: competition.place,
                likes:  0,
                organizator:  competition.organizator,
                category:  competition.category,      //TODO: Create category if does not exist
                joinedUsers:  [],
                points:  competition.points,
                level:  competition.level,
                keys:  competition.keys,
                passed: false
            });

            return new Promise((resolve, reject) => {
                newCompetition.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newCompetition);
                });
            });
        }

        //TODO:
        // UpdateCompetitionLikes()
        // AddNewJoinedUser()
        // UpdateCompetitionToPassed()
    };
};