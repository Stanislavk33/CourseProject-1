"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const progressbarSchema = new Schema({
    totalPoints: {Type: Number, required: true},
    categoriesPoints: [{
        name: {Type: String, required: true},
        points: {Type: String, required: true}
    }]
});

const Progressbar = mongoose.model("Progressbar", progressbarSchema);

module.exports = mongoose.model("Progressbar");