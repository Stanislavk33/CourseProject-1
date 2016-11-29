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

                    return res.status(200).render(view, { result: user });
                })
                .catch((err) => {
                    return res.status(500).json(err);
                })
        },
        getEditPage(req, res) {
            const username = req.params.username;
            console.log(username);

            if (req.isAuthenticated() && req.user.username === username) {
                data.getUserByUsername(username)
                    .then((user) => {
                        return res.status(200).render('edit-profile', { result: user });
                    })
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Not authorized!'
                })
            }
        },
        editProfile(req, res) {
            const username = req.params.username;

            if (!req.isAuthenticated() || req.user.username !== username) {
                return res.status(400).json({
                    success: false,
                    message: 'Not authorized!'
                })
            }

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
                    return res.status(500).json(err);
                })
        },
        logoutUser(req, res) {
            req.logout();
            res.redirect("/");
        },
        loadRegisterPage(req, res) {
            res.render("user/register");
        },
        loadLoginPage(req, res) {
            res.render("user/login");
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
                category = req.body.category;

            data.updatePoints(username, points, category)
                .then(user => {
                    if (user === null) {
                        return res.status(400)
                            .redirect('/error');
                    }
                })
        },
        login(req, res) {
            // TODO
        },
        logout(req, res) {
            // TODO
        }
    }
}