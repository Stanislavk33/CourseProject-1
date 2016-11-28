/* globals module require */
'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const progressbarSchema = new Schema({
    totalPoints: { type: Number, required: true },
    categoriesPoints: [{
        name: { type: String, required: true },
        points: { type: Number, required: true }
    }]
});

module.exports = progressbarSchema;