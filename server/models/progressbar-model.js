/* globals module require */
"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const progressbarSchema = new Schema({
    totalPoints: { type: Number, required: true },
    categoriesPoints: [{
        name: { type: String, required: true },
        points: { type: String, required: true }
    }]
});

module.exports = progressbarSchema;