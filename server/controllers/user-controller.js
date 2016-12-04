'use strict';
const PAGE_SIZE = 6;

module.exports = ({ data }) => {
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
                    // console.log({ result: { userForProfile: user, user: req.user } });
                    return res.status(200).render(view, { result: { userForProfile: user, user: req.user } });
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        },
        getEditPage(req, res) {
            const username = req.params.username;

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
                    return data.updateAttendedStatusToUser(username, competitionId)
                })
                .then(() => {
                    return res.status(200).json({
                        success: true
                    });
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        },
        loadUsers(req, res) {
            let page = +req.query.page || 1
            if (req.query.search) {
                const searchName = req.query.search;
                Promise.all([data.searchUsersByName(searchName, page, PAGE_SIZE), data.getCountOfFilteredUsers(searchName)])
                    .then(([users, usersCount]) => {
                        let pagesCount = Math.floor(usersCount / PAGE_SIZE);
                        if ((usersCount % PAGE_SIZE) !== 0) {
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