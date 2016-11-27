'use strict';

const LocalStrategy = require('passport-local');

module.exports = (passport, data) => {
    const authStrategy =  new LocalStrategy(
        (username, password, done) => {
            data.getUserByUsername(username)
                .then(user => {
                    if(user && user.password === password) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
                .catch(err => done(err, false));
        }
    )

    passport.use(authStrategy);
}