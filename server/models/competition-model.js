/* globals module require */
"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const constants = require("../utilities/constants");
const Status = constants.competitionStatus;

const competitionSchema = new Schema({
    name: { type: String, require: true },
    place: { type: String, required: true },
    likes: { type: Number, required: true },
    organizator: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    joinedUsers: {
        type: [{
            username: { type: String, required: true },
            attended: { type: Boolean, default: false }
        }]
    },
    points: { type: Number, required: true },
    level: { type: String, required: true },
    keys: [String],
    location: {
        latitude: { type: String },
        longitude: { type: String }
    },
    passed: { type: String, enum: Status, required: true }
});

mongoose.model("Competition", competitionSchema);
module.exports = mongoose.model("Competition");