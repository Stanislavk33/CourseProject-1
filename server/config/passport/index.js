'use strict';

const passport = require('passport');

module.exports = (app, data) => {

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user.id);
        }
    });

    passport.deserializeUser((userId, done) => {
        data.getUserById(userId)
            .then(user => {
                if (user) {
                    user.isOrganizator = user.roles.indexOf('organizator') >= 0;
                    user.isAdmin = user.roles.indexOf('admin') >= 0;
                }
                done(null, user || false);
            })
            .catch(err => {
                done(err, false);
            });
    });
    require('./local-strategy')(passport, data);
    require('./facebook-strategy')(passport, data);
    app.use(passport.initialize());
    app.use(passport.session());
}