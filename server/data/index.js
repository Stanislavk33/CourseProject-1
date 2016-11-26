/* globals module require */
"use strict"

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

module.exports = function(config) {
    mongoose.connect(config.connectionString);
   let Competition = require("../models/competition-model");
   let Category = require("../models/category-model");
   let User = require("../models/user-model");
   let UserGallery = require("../models/user-gallery-model");
   let ForumPost = require("../models/forum-post-model");

    //TODO - add other models in model object
   let models = { Competition, Category, User, UserGallery, ForumPost };
    let data = {};

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