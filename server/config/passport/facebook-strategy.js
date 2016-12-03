/* globls require */
'use strict';

const config = require('../index.js');
const FacebookStrategy = require('passport-facebook');

module.exports = function (passport, data) {

    passport.use(new FacebookStrategy({
        clientID: "964923163611936",
        clientSecret: "9e5742ada2ae2e3700b0c2444fec118d",
        callbackURL: 'http://localhost:3001/auth/facebook/callback'
    }, (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            data.findUserByFacebookId(profile.id)
                .then((user) => {
                    if (user) {
                        return done(null, user);
                    } else {
                        const names = profile.displayName.split(' ');

                        // TODO: fix constants

                        const firstName = names[0];
                        const lastName = names[1] || names[0];

                        return data.createUser({
                            username: profile.displayName.replace(' ', ''),
                            firstName: profile.name.givenName || firstName,
                            lastName: profile.name.familyName || lastName,
                            passHash: profile.displayName,
                            image: 'default.png',
                            facebookId: profile.id
                            // facebookToken: token
                        });

                    }
                })
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return;
                })
                .catch(err => done(err, false));
        });
    }));
}








//     // data.findOne({ facebookId: profile.id }, (err, user) => {
//     //     if (err) {
//     //         return done(err);
//     //     } else if (user) {
//     //         return done(null, user);
//     //     } else {
//     //        data.createUser({
//     //             username: profile.displayName + configAuth.facebookAuth.usernameSuffix,
//     //             firstname: profile.name.givenName || profile.displayName,
//     //             lastname: profile.name.familyName || profile.displayName,
//     //             passHash: profile.displayName,
//     //             salt: profile.id,
//     //             facebookId: profile.id,
//     //             facebookToken: token
//     //         });

//     //         newUser.save((err) => {
//     //             if (err) {
//     //                 return done(err);
//     //             }
//     //             return done(null, newUser);
//     //         });
//     //     }
//     // });