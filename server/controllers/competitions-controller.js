'use strict';

module.exports = (data) => {
    return {
        getByID(req, res) {
            const id = req.params.id;

            let view = 'competition',
                userName = req.user.username;
            console.log(userName);
            if (req.isAuthenticated()) {
                view = 'competition-user';
            }
            data.getCompetitionById(id)
                .then(competition => {
                    if (userName === competition.organizator) {
                        competition.isOrgan = true;
                        console.log('here');
                        console.log(competition.isOrgan);
                    }
                    console.log(competition)
                    res.render(view, { result: competition });
                });
        },
        getCreatePage(req, res) {
            return res.status(200).render('create-competition', {
                result: ['hiking', 'skiing', 'swimming']
            });
        },
        joinCompetition(req, res) {
            if (!req.isAuthenticated()) {
                res.status(400).json({
                    success: false,
                    message: 'Not authorized to join competition.'
                });
            } else {
                const username = req.user.username,
                    id = req.params.id;

                // TODO: what will the request return
                data.addJoinedUserToCompetition(id, username)
                    .then((competition) => {
                        const userCompetition = {
                            _id: competition._id,
                            name: competition.name,
                            place: competition.place
                        }
                        return data.addCompetitionToUser(username, userCompetition);
                    })
                    .then((user) => {
                        res.status(200).json({
                            result: {
                                username: user.username,
                                points: user.progress.totalPoints
                            }
                        });
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    });
            }
        },
        leaveCompetition(req, res) {
            if (!req.isAuthenticated()) {
                res.status(400).json({
                    success: false,
                    message: 'Not authorized to join competition.'
                });
            } else {
                const username = req.user.username,
                    id = req.params.id;

                data.removeUserFromCompetition(id, username)
                    .then((competition) => {
                        return data.removeCompetitionFromUser(username, id);
                    })
                    .then(() => {
                        // TODO: what to return;
                        res.status(200).json();
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    });

            }
        },
        likes(req, res) {
            // TODO 
        },
        loadCompetitions(req, res) {
            data.getAllCompetitions()
                .then(competitions => {
                    res.render('competition-list', { result: competitions });
                });
        },
        createCompetition(req, res) {
            let body = req.body,
                user = 'admin', // req.user.username 
                keys = body.keys
                    .split(' ')
                    .filter(x => x !== '');

            data.createCompetition({
                name: body.name,
                place: body.place,
                organizator: user,
                category: body.category,
                points: body.points,
                level: body.level,
                startDate: body.startDate,
                endDate: body.endDate,
                keys: keys,
                location: { longitude: body.longitude, latitude: body.latitude }
            })
                .then(competition => {
                    res.redirect(`/competitions/${competition._id}`);
                }).catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
        }
    };
};