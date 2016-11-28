/* globals module require */
"use strict"

const mongoose = require("mongoose");
const encryptor = require("../utilities/encryptor");
const Schema = mongoose.Schema;

const progressbarSchema = require("./progressbar-model");

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    firstName: { type: String, match: /^[A-Z]([a-z]?)+$/, required: true },
    lastName: { type: String, match: /^[A-Z]([a-z]?)+$/, required: true },
    passHash: { type: String, required: true },
    birthDate: { type: Date },
    email: { type: String, required: true },
    image: { type: String, default: '' },
    competitions: [{ 
        // TODO: decide on information
    }],
    progress: { type: progressbarSchema },
    inRole : { type: String, default: 'normal' }
    
});

userSchema.methods = {
    isValidPassword(password) {
        let realPassHash = this.passHash;
        let currentPassHash = encryptor.getPassHash(this.salt, password);
        if (currentPassHash === realPassHash) {
            return true;
        } else {
            return false;
        }
    }
};

mongoose.model("User", userSchema);
module.exports = mongoose.model("User");