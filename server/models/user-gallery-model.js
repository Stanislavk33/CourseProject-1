"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userGallerySchema = new Schema({
    username: { type: String, unique: true, required: true },
    photos: [{
        image: { type: String, required: true },
        date: { type: Date, required: true },
        place: { type: String, required: true },
        category: { type: String, required: true },
        title: {type: String, required: true}
    }]
});

mongoose.model("UserGallery", userGallerySchema);
module.exports = mongoose.model("UserGallery");
