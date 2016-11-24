/* globals module require */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const constants = require("../utilities/constants");
const Status = constants.competitionStatus;

const categorySchema = new Schema({
    title: { type: String, required: true, unique: true },
    competitions: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        status: { enum: Status, required: true },
        organizator: { type: String, required: true, unique: true },
    }]
});

mongoose.model("Category", categorySchema);

module.exports = mongoose.model("Category");