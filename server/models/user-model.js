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
    birthDate: { type: Date },
    email: { type: String, required: true },
    image: { type: String, default: '' },
    competitions: [{
        // TODO: decide on information
    }],
    progress: { type: progressbarSchema },
    inRole: { type: String, default: 'normal' }

});

userSchema.methods = {
    isValidPassword(password) {
        let realPassHash = this.passHash;
        let currentPassHash = encryption.getPassHash(this.salt, password);
        let isValid = currentPassHash === realPassHash;

        return isValid;
    }
};

const User = mongoose.model('User', userSchema);

function addAdmin() {
    User.find({ username: "admin" })
        .then(user => {
            if (!user.length) {
                let salt = encryption.getSalt();
                let passHash = encryption.getPassHash(salt, "admin");
                let adminUser = new User({
                    username: "admin",
                    salt,
                    passHash,
                    roles: ["admin"]
                });

                adminUser.save();
            }
        })
        .catch(console.log);
}

module.exports = { addAdmin };