'use strict';

module.exports = (data) => {
    return {
          loadRegisterPage(req, res) {
            return res.status(200).render('register');
        },
        register(req, res) {
            const user = {
                username: req.body.username,
                passHash: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthDate: req.body.birthDate,
                email: req.body.email,
                competitions: {},

            };

            data.createUser(user)
                .then(dbUser => {
                    res.status(201)
                        .send('<h1>asdf</h1>');
                })
                .catch(err => res.status(500).json(err));
        }
    }
}