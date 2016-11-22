"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const competitionSchema = new Schema({
    place: {
        type: String,
        required: true
    },
    likes: { type: Number, required: true},
    organizator:
    {
        _id: { Type: String, required: true },
        username: { Type: String, required: true }
    },
    category: {
        _id: { Type: String, required: true },
        name: { Type: String, required: true }
    },
    joinedUsers: {
        type: [{
            _id: { Type: String, required: true },
            username: { Type: String, required: true }
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
        // string google link for rendering
        // {latitude, longitute}
    },
    passed: {
        Type: Boolean, required: true
    }
    // TODO: maybe add users who took part
});

const Competition = mongoose.model("Competition", competitionSchema);

module.exports = mongoose.model("Competition");