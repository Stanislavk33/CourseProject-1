/* globals require module __dirname */
'use strict';

const fs = require('fs'),
    path = require('path'),
    authentication = require('../middlewares/auth-middleware');

module.exports = ({ app, data, controllers, uploadUserImage, uploadCompetitionImage, uploadCategoryImage }) => {
    fs.readdirSync('./server/routers')
        .filter(x => x.includes('-router'))
        .forEach(file => {
            require(path.join(__dirname, file))({ app, data, controllers, authentication, uploadUserImage, uploadCompetitionImage, uploadCategoryImage });
        });

    app.get('*', function (req, res) {
        res.status(404).redirect('/404');
    });

};