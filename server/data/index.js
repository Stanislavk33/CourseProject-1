/* globals module require */
"use strict"

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

module.exports = function(config) {
    mongoose.connect(config.connectionString);
   const Competition = require("../models/competition-model");
   const Category = require("../models/category-model");
   const User = require("../models/user-model");
   const UserGallery = require("../models/user-gallery-model");
   const ForumPost = require("../models/forum-post-model");

    //TODO - add other models in model object
   const models = { Competition, Category, User, UserGallery, ForumPost };
    const data = {};

    fs.readdirSync("./server/data")
        .filter(x => x.includes("-data")) 
        .forEach(file => {
            let dataModule =
                require(path.join(__dirname, file))(models);
            Object.keys(dataModule)
                .forEach(key => {
                    data[key] = dataModule[key];
                });
        });

    return data;
}