'use strict';

module.exports = ({data}) => {
    return {
        getProfile(req, res) {
            const username = req.params.username;
            let view = 'users/user-profile';
            let asPersonalPage = false;

            if (req.isAuthenticated()) {
                if (req.user.username === username) {
                    asPersonalPage = true;
                    view = 'users/personal-profile';
                }
            }

            data.getUserByUsername(username, asPersonalPage)
                .then((user) => {
                    if (!user) {
                        throw new Error("No user found!");
                    }

                    return res.status(200).render(view, { result: { userForProfile: user, user: req.user } });
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        },
        getEditPage(req, res) {
            const username = req.params.username;
            console.log(username);

            data.getUserByUsername(username)
                .then((user) => {
                    if (!user) {
                        throw new Error("No user found!");
                    }
                    return res.status(200).render('users/edit-profile', { result: { user: req.user } });
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
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
                    res.status(500).redirect('/500');
                });
        },
        logoutUser(req, res) {
            req.logout();
            res.redirect("/");
        },

        // TODO: delete method if not used
        loadRegisterPage(req, res) {
            res.render("users/user/register", { result: { user: req.user } });
        },
        // TODO: delete method if not used
        loadLoginPage(req, res) {
            res.render("users/user/login", { result: { user: req.user } });
        },

        // TODO: delete method if not used
        getById(req, res) {
            data.getUserById(req.params.id)
                .then(user => {
                    if (user === null) {
                        return res.status(400)
                            .redirect('/error');
                    }

                    // TODO: return res.render...
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        },
        addPoints(req, res) {
            const username = req.body.username,
                points = +req.body.points,
                category = req.body.category,
                competitionId = req.body.competitionId;

            // TODO: fix redirect
            data.updatePoints(username, points, category)
                .then(user => {
                    if (!user) {
                        throw new Error("No user found!");
                    }
                }).then(() => {
                    data.updateAttendedStatusToUser(username, competitionId)
                        .then(() => {
                            return res.status(200);
                        })
                        .catch(er => {
                            throw er;
                        })
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
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

                        return res.status(200).render('users/users', {
                            result: {
                                users,
                                searchName,
                                user: req.user,
                                params: { pagesCount, page }
                            }
                        });
                    })
                    .catch((err) => {
                        res.status(500).redirect('/500');
                    });
            } else {
                data.getTopUsers()
                    .then(users => {
                        return res.status(200).render('users/users', { result: { users, user: req.user } });
                    })
                    .catch((err) => {
                        res.status(500).redirect('/500');
                    });
            }
        }
    }
}