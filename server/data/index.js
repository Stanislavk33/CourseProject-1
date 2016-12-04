/* globals module require */
'use strict';

const mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path');

module.exports = function(config) {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.connectionString);

    const Competition = require('../models/competition-model'),
        Category = require('../models/category-model'),
        User = require('../models/user-model'),
        ForumPost = require('../models/forum-post-model'),
        validator = require('../utilities/validator'),
        models = { Competition, Category, User, ForumPost },
        data = {};

    fs.readdirSync('./server/data')
        .filter(x => x.includes('-data'))
        .forEach(file => {
            const dataModule =
                require(path.join(__dirname, file))(models, validator);
            Object.keys(dataModule)
                .forEach(key => {
                    data[key] = dataModule[key];
                });
        });

    return data;
}