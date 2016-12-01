/* globals module require */
'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    constants = require('../utilities/constants'),
    Status = constants.competitionStatus;

const categorySchema = new Schema({
    link: {
        type: String,
        required: true,
        minlength: constants.MIN_LINK_LENGTH,
        maxlength: constants.MAX_LINK_LENGTH
    },
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: constants.MIN_TITLE_LENGTH,
        maxlength: constants.MAX_TITLE_LENGTH
    },
    description: {
        type: String,
        minlength: constants.MIN_DESCRIPTION_LENGTH,
        maxlength: constants.MAX_DESCRIPTION_LENGTH
    },
    image: { type: String, required: true },
    competitions: [{
        _id: { type: String, required: true },
        name: {
            type: String,
            required: true,
            minlength: constants.MIN_NAME_LENGTH,
            maxlength: constants.MAX_NAME_LENGTH
        },
        place: {
            type: String,
            required: true,
            minlength: constants.MIN_COMPETITION_PLACE_LENGTH,
            maxlength: constants.MAX_COMPETITION_PLACE_LENGTH
        },
        status: { type: String, enum: Status, required: true },
        organizator: {
            type: String,
            required: true,
            minlength: constants.MIN_NAME_LENGTH,
            maxlength: constants.MAX_NAME_LENGTH
        },
    }]
});

mongoose.model('Category', categorySchema);

module.exports = mongoose.model('Category');