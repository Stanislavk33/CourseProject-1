"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    //TODO: include some specific categories
});

const Category = mongoose.model("Category", categorySchema);

module.exports = mongoose.model("Category");