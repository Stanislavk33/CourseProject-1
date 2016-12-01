/* globals module require */
'use strict';

const mongoose = require('mongoose'),
    encryptor = require('../utilities/encryptor'),
    Schema = mongoose.Schema,
    progressbarSchema = require('./progressbar-model');

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    firstName: { type: String, match: /^[A-Z]([a-z]?)+$/, required: true },
    lastName: { type: String, match: /^[A-Z]([a-z]?)+$/, required: true },
    passHash: { type: String, required: true },
    salt: { type: String, required: true },
    birthDate: { type: Date },
    email: { type: String },
    image: { type: String, default: '' },
    competitions: [{
        // TODO: decide on information
    }],
    facebookId: { type: String },
    facebookToken: { type: String },
    progress: { type: progressbarSchema },
    inRole: { type: String, default: 'normal' }
});

userSchema.methods = {
    isValidPassword(password) {
        console.log(password, this);
        const realPassHash = this.passHash,
            currentPassHash = encryptor.getPassHash(this.salt, password);
        if (currentPassHash === realPassHash) {
            return true;
        } else {
            return false;
        }
    }
};


mongoose.model('User', userSchema);

module.exports = mongoose.model('User');