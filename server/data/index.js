/* globals module require */
"use strict"

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

module.exports = function(config) {
    mongoose.connect(config.connectionString);
    let Competition = require("../models/competition-model");

    // TODO - add other models in model object
    let models = { Competition };
    let data = {};

    fs.readdirSync("./server/data")
        .filter(x => x.includes("competition-data")) // shoud be "-data"
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