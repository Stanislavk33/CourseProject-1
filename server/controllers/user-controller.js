'use strict';

module.exports = (data) => {
    return {
        getProfile(req, res) {
            const username = req.params.username;
            let view = 'user-profile';
            let asPersonalPage = false;

            if (req.isAuthenticated()) {
                if (req.user.username === username) {
                    asPersonalPage = true;
                    view = 'personal-profile';
                }
            }

            data.getUserByUsername(username, asPersonalPage)
                .then((user) => {
                    if (!user) {
                        return res.status(400)
                            .redirect('/error');
                    }

                    return res.status(200).render(view, { result: { userForProfile: user, user: req.user } });
                })
                .catch((err) => {
                    return res.status(500).json(err);
                })
        },
        getEditPage(req, res) {
            const username = req.params.username;
            console.log(username);

            data.getUserByUsername(username)
                .then((user) => {
                    return res.status(200).render('edit-profile', { result: { user: req.user } });
                });
        },
        editProfile(req, res) {
            const username = req.params.username;

            const userInfo = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthDate: req.body.birthDate,
                email: req.body.email
            };

            if (req.file) {
                userInfo.image = req.file.filename;
            }
            console.log(userInfo);
            data.updateUserInformation(username, userInfo)
                .then(() => {
                    return res.redirect(`/users/${username}`);
                })
                .catch((err) => {
                    return res.status(500).json(err);
                })
        },
        logoutUser(req, res) {
            req.logout();
            res.redirect("/");
        },
        loadRegisterPage(req, res) {
            res.render("user/register", { result: { user: req.user } });
        },
        loadLoginPage(req, res) {
            res.render("user/login", { result: { user: req.user } });
        },
        getById(req, res) {
            data.getUserById(req.params.id)
                .then(user => {
                    if (user === null) {
                        return res.status(400)
                            .redirect('/error');
                    }

                    // TODO: return res.render...
                });
        },
        addPoints(req, res) {
            const username = req.body.username,
                points = req.body.points,
                category = req.body.category,
                competitionId = req.body.competitionId;

            data.updatePoints(username, points, category)
                .then(user => {
                    if (user === null) {
                        return res.status(400)
                            .redirect('/error');
                    }
                }).then(() => {
                    data.updateAttendedStatusToUser(username, competitionId)
                        .catch(er => {
                            return res.status(400)
                                .redirect('/error');
                        })
                })
        },
        loadUsers(req, res) {
            let page = +req.query.page || 1
            const count = 2;
            if (req.query.search) {
                const searchName = req.query.search;
                console.log(searchName);
                Promise.all([data.searchUsersByName(searchName, page, count), data.getCountOfFilteredUsers(searchName)])
                    .then(([users, usersCount]) => {
                        let pagesCount = Math.floor(usersCount / count);
                        if ((usersCount % count) !== 0) {
                            pagesCount += 1;
                        }

                        return res.status(200).render('users', {
                            result: {
                                users,
                                searchName,
                                user: req.user,
                                params: { pagesCount, page }
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json(err).render('error', { result: { user: req.user } });
                    });

            } else {
                data.getTopUsers()
                    .then(users => {
                        return res.status(200).render('users', { result: { users, user: req.user } });
                    })
                    .catch(err => {
                        return res.status(500).json(err).render('error', { result: { user: req.user } });
                    });
            }
        }
    }
}