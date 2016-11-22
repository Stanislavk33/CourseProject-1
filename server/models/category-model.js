"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {Type: String, required: true},
    competitions: [{
        _id: {Type: String, required: true},
        name: {Type: String, required: true}
        // TODO: Decide if more information 
    }]
});

const Category = mongoose.model("Category", categorySchema);

module.exports = mongoose.model("Category");