'use strict';

module.exports = ({data}) => {
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
                        competition.isOrganizator = true;
                    }
                    if (competition.joinedUsers.find(x => x.username === username)) {
                        competition.hasJoined = true;
                    }

                    competition.passed = competition.getPassed();
                    res.render(view, { result: { competition, user: user } });
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
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
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
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
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        },
        leaveCompetition(req, res) {
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
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
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
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
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
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        },
        loadCompetitions(req, res) {

            const page = +req.query.page || 1,
                count = 2;
            Promise.all([data.getAllCompetitions(page, count), data.getCompetitionsCount()])
                .then(([competitions, compCount]) => {
                    competitions.forEach(x=>{
                        x.passed = x.getPassed();
                    });
                    const pagesCount = Math.ceil(compCount / count);
                    res.render('competition-list', { result: { competitions, user: req.user, params: { pagesCount, page } } });
                });
        },
        createCompetition(req, res) {
            let body = req.body,
                user = req.user.username;
            data.createCompetition({
                name: body.competitionName,
                place: body.place,
                organizator: user,
                category: body.category,
                description: body.description,
                points: body.points,
                level: body.level,
                startDate: body.startDate,
                endDate: body.endDate,
                image: req.file ? req.file.filename : 'default.jpg',
                location: { longitude: body.longitude, latitude: body.latitude }
            })
                .then(competition => {
                    return data.addCompetitionToCategory(competition)
                })
                .then((competition) => {
                    res.redirect(`/competitions/${competition._id}`);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).redirect('/500');
                });
        }
    };
};