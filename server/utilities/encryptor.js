'use strict';

const crypto = require('crypto');

module.exports = {
    getSalt() {
        const salt = crypto.randomBytes(128).toString('base64');
        return salt;
    },
    getPassHash(salt, pwd) {
        const passHash = crypto
            .createHmac('sha256', salt)
            .update(pwd)
            .digest('hex');

        return passHash;
    }
};