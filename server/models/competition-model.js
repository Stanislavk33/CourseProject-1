"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const competitionSchema = new Schema({
    place: {
        type: String,
        required: true
    },
    organizator: {
        //TODO: include user-model
        required: true
    },
    category: {
        //TODO: include category-model
        required: true
    },
    joinedUsers: {
        type: [String]
    },
    points: {
        type: Number,
        required: true
    },
    //TODO: keys for searching
});