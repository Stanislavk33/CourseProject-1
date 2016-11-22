"use strict"

const mongoose = require("mongoose");
const encrypt = require("../utilities/encryptor");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        match: /^[A-Z]([a-z]?)+$/,
        required: true
    },
    lastName: {
        type: String,
        match: /^[A-Z]([a-z]?)+$/,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthDate: {
        Type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    competitions: [{
        // TODO: decide on information
    }]
    //TODO: include progressbar-model 
    //include competition-model
});

progressbar{
    mainpoints,
    categories:[
        1: points,
        2: points, color
    ]
}


userSchema.methods = {
    isValidPassword(password) {
        let realPassHash = this.passHash;
        let currentPassHash = encryption.getPassHash(this.salt, password);
        if (currentPassHash === realPassHash) {
            return true;
        } else {
            return false;
        }
    }
};

const User = mongoose.model("User", userSchema);

//TODO: add function to find specific user => admin

module.exports = mongoose.model("User");