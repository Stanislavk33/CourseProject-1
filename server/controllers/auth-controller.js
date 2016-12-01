'use strict';

const passport = require('passport');

module.exports = (data) => {
    return {
        loadRegisterPage(req, res) {
            return res.status(200).render('register');
        },
        loadLoginPage(req, res) {
            return res.status(200).render('login');
        },
        register(req, res) {
            const user = {
                username: req.body.username,
                passHash: req.body.password,
                salt: req.body.salt,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthDate: req.body.birthDate,
                image: req.file ? req.file.filename : 'default.png',
                email: req.body.email,
                competitions: {},

            };

            data.createUser(user)
                .then(dbUser => {
                    res.status(201)
                        .redirect('/auth/login');
                })
                .catch(err => res.status(500).json(err));
        },
        loginLocal(req, res, next) {
            const auth = passport.authenticate('local', (err, user) => {
                if (err) {
                    next(err);
                    return;
                }

                if (!user) {
                    res.json({
                        success: false,
                        message: 'Invalid username or password'
                    });
                }

                req.login(user, err => {
                    if (err) {
                        next(err);
                        return;
                    }

                    res.status(201).redirect('/home');
                });
            });

            auth(req, res, next);
        },
        logout(req, res) {
            req.logout();
            res.status(200).send('<h1>Logged Out</h1>');
        }
    }
}