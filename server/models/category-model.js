/* globals module require */
"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: { type: String, required: true },
    competitions: [{
        _id: { type: String, required: true },
        name: { type: String, required: true }
        // TODO: Decide if more information 
    }]
});

mongoose.model("Category", categorySchema);

module.exports = mongoose.model("Category");