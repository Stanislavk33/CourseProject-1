/* globals module require */
'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    constants = require('../utilities/constants'),
    Status = constants.competitionStatus;

const competitionSchema = new Schema({
    name: { type: String, required: true },
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
    location: {
        latitude: { type: String },
        longitude: { type: String }
    },
    passed: { type: String, enum: Status, required: true },
    usersLiked: [{
        user: String
    }],
});

mongoose.model('Competition', competitionSchema);

module.exports = mongoose.model('Competition');