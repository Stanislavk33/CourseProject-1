/* globals module require */
"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const constants = require("../utilities/constants");
const Status = constants.competitionStatus;

const competitionSchema = new Schema({
    place: {
        type: String,
        required: true
    },
    likes: { type: Number, required: true },
    organizator: {
        _id: { type: String, required: true },
        username: { type: String, required: true, unique: true }
    },
    category: {
        _id: { type: String, required: true },
        name: { type: String, required: true }
    },
    joinedUsers: {
        type: [{
            _id: { type: String, required: true },
            username: { type: String, required: true }
        }]
    },
    points: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    keys: [String],
    location: {
        latitude: { type: String },
        longitute: { type: String }
        // {latitude, longitute}
    },
    passed: {
        enum: Status,
        required: true
    }
    // TODO: maybe add users who took part
});

mongoose.model("Competition", competitionSchema);

module.exports = mongoose.model("Competition");