'use strict';

module.exports = (data) => {
    return {
        getByID(req, res) {
            const id = req.params.id;

            let view = 'competition';
            let username;
            let user = req.user;

            if (req.isAuthenticated()) {
                view = 'competition-user';
                username = user.username;
            }
            data.getCompetitionById(id)
                .then(competition => {
                    if (username === competition.organizator) {
                        // view = 'some-new-view';
                        competition.isOrgan = true;
                    }
                    if (competition.joinedUsers.find(x => x.username === username)) {
                        competition.hasJoined = true;
                    }

                    competition.passed = competition.getPassed();
                    res.render(view, { result:{ competition, user: user} });
                });
        },
        getCreatePage(req, res) {
            data.getAllCategories()
                .then(categories => {
                    return categories.map(c => c.title)
                })
                .then(categoriesTitles => {
                    return res.status(200).render('create-competition', {
                        result: {
                            categoriesTitles,
                            user: req.user
                        }
                    });
                });
        },
        joinCompetition(req, res) {
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
                    res.status(200).json({
                        success: true,
                        username
                    });
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        }
    },
    likeCompetition(req, res) {
        const competitionId = req.params.id;
        let update = { $inc: { likes: 1 } };
        data.updateCompetition(competitionId, update, null)
            .then((competition) => {
                let user = req.user.username;
                competition.usersLiked.push(user);
                competition.save();
                return competition;
            })
            .then((competition) => {
                res.json(JSON.stringify(competition.likes + 1));
            });
    },
    dislikeCompetition(req, res) {
        const competitionId = req.params.id;
        let update = { $inc: { likes: -1 } };
        data.updateCompetition(competitionId, update, null)
            .then((competition) => {
                let user = req.user.username;
                competition.usersLiked.pull(user);
                competition.save();
                return competition;
            })
            .then((competition) => {
                res.json(JSON.stringify(competition.likes + 1));
            });
    },
    loadCompetitions(req, res) {
        data.getAllCompetitions()
            .then(competitions => {
                res.render('competition-list', { result: { competitions, user: req.user } });
            });
    },
    createCompetition(req, res) {
        let body = req.body,
            user = req.user.username;

        console.log(body.competitionName + "   asdsadsa");
        data.createCompetition({
            name: body.competitionName,
            place: body.place,
            organizator: user,
            category: body.category,
            points: body.points,
            level: body.level,
            startDate: body.startDate,
            endDate: body.endDate,
            image: req.file ? req.file.filename : 'default.jpg',
            location: { longitude: body.longitude, latitude: body.latitude }
        })
            .then(competition => {
                data.addCompetitionToCategory(competition)
                    .then(() => {
                        res.redirect(`/competitions/${competition._id}`);
                    }).catch(err => {
                        res.status(500).json(err);
                    });
            }).catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
};
};