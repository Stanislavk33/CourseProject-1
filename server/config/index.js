/* globals module */
'use strict';

module.exports = {
    port: 3001,
    connectionString: 'mongodb://localhost:27017/conquerDb',
    facebookAuth: {
        clientID: '964923163611936',
        clientSecret: '9e5742ada2ae2e3700b0c2444fec118d',
        callbackUrl: 'http://localhost:3001/auth/facebook/callback'
    }

};