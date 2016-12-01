const constants = require('../utilities/constants');

module.exports = {
    isValidUser(user) {
        if (lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, user.firstName) &&
            lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, user.lastName) &&
            lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, user.username) &&
            constants.NAME_REGEX.test(user.firstName) && constants.NAME_REGEX.test(user.lastName) &&
            user.email && constants.EMAIL_REGEX.test(user.email)) {
            return true;
        }

        return false;
    },
    isValidPoints(points) {
        if (points < 0 || points > 150) {
            return false;
        }

        return true;
    }
}

function lengthValidation(min, max, value) {
    if (!value) {
        return false;
    }

    if (min <= value.length && value.length <= max) {
        return true;
    }

    return false;
}