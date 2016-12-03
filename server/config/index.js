/* globals module */
'use strict';

const connectionStrings = {
    production: process.env.CONNECTION_STRING,
    development: "mongodb://localhost:27017/conquerDb"
};

module.exports = {
    connectionString: connectionStrings[process.env.NODE_ENV || "development"],
    port: process.env.PORT || 3001,
    facebookAuth: {
        clientID: '964923163611936',
        clientSecret: '9e5742ada2ae2e3700b0c2444fec118d',
        callbackUrl: 'http://localhost:3001/auth/facebook/callback'
    }

};