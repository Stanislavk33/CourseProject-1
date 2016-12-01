/* globals module require */
'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    constants = require('../utilities/constants'),
    Status = constants.competitionStatus;

const categorySchema = new Schema({
    link: {type: String, required: true},
    title: { type: String, required: true, unique: true },
    description: { type: String },
    image: {type: String, required: true},
    competitions: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        place: { type: String, required: true },
        status: { type: String, enum: Status, required: true },
        organizator: { type: String, required: true },
    }]
});

mongoose.model('Category', categorySchema);

module.exports = mongoose.model('Category');