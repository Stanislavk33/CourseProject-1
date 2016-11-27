'use strict';

const passport = require('passport');
const data = require('./../../data');

passport.serializeUser((user, done) => {
    if(user) {
        done(null, user.id);
    }
});

passport.deserializeUser((userId, done) => {
    data.getUserById(userId)
        .then(user => {
            done(null, user || false);
        })
        .catch(err => {
            done(err, false);
        });
});

require('./local-strategy')(passport, data);

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
}