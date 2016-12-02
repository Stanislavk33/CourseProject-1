/* globals module require */
'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    constants = require('../utilities/constants'),
    Status = constants.competitionStatus;

const competitionSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: constants.MIN_COMPETITION_NAME_LENGTH,
        maxlength: constants.MAX_COMPETITION_NAME_LENGTH
    },
    place: {
        type: String,
        required: true,
        minlength: constants.MIN_COMPETITION_PLACE_LENGTH,
        maxlength: constants.MAX_COMPETITION_PLACE_LENGTH
    },
    likes: { type: Number, required: true },
    organizator: {
        type: String,
        required: true,
        minlength: constants.MIN_NAME_LENGTH,
        maxlength: constants.MAX_NAME_LENGTH
    },
    category: {
        type: String,
        required: true,
        minlength: constants.MIN_CATEGORY_LENGTH,
        maxlength: constants.MAX_CATEGORY_LENGTH
    },
    description: {
        type: String,
        minlength: constants.MIN_DESCRIPTION_LENGTH,
        maxlength: constants.MAX_DESCRIPTION_LENGTH
    },
    joinedUsers: {
        type: [{
            username: {
                type: String,
                required: true,
                minlength: constants.MIN_NAME_LENGTH,
                maxlength: constants.MAX_NAME_LENGTH
            },
            attended: { type: Boolean, default: false }
        }]
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    image: { type: String },
    points: {
        type: Number,
        required: true,
        min: constants.MIN_POINTS,
        max: constants.MAX_POINTS
    },
    level: {
        type: String,
        required: true,
        minlength: constants.MIN_LEVEL_LENGTH,
        maxlength: constants.MAX_LEVEL_LENGTH
    },
    location: {
        latitude: { type: String },
        longitude: { type: String }
    },
    usersLiked: [String],
});

competitionSchema.methods.getPassed = function() {
    if (+Date.now() > +new Date(this.endDate)) {
        return 'passed';
    } else if (+new Date(this.startDate) < +Date.now() &&
        +Date.now() < +new Date(this.endDate)) {
        return 'ongoing';
    } else {
        return 'upcoming';
    };
};

mongoose.model('Competition', competitionSchema);

module.exports = mongoose.model('Competition');