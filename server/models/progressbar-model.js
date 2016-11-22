"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const progressbarSchema = new Schema({
    //TODO: add all categories titles and for each of them add points
});

const Progressbar = mongoose.model("Progressbar", progressbarSchema);

module.exports = mongoose.model("Progressbar");