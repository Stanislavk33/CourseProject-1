const constants = require('../utilities/constants');

module.exports = {
    isValidUser(user) {
        if (lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, user.firstName) &&
            lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, user.lastName) &&
            lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, user.username) &&
            constants.NAME_REGEX.test(user.firstName) && constants.NAME_REGEX.test(user.lastName) &&
            (user.email ? constants.EMAIL_REGEX.test(user.email) : true)) {
            return true;
        }

        return false;
    },
    isValidPoints(points) {
        if (points < 0 || points > 150) {
            return false;
        }

        return true;
    },
    isValidCategory(category) {
        if (lengthValidation(constants.MIN_CATEGORY_LENGTH, constants.MAX_CATEGORY_LENGTH, category.title) &&
            lengthValidation(constants.MIN_DESCRIPTION_LENGTH, constants.MAX_DESCRIPTION_LENGTH, category.description)) {
            return true;
        }

        return false;
    },
    validateCompetition(competition) {
        if (lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, competition.name) &&
            lengthValidation(constants.MIN_COMPETITION_PLACE_LENGTH, constants.MAX_COMPETITION_PLACE_LENGTH, competition.place) &&
            lengthValidation(constants.MIN_DESCRIPTION_LENGTH, constants.MAX_DESCRIPTION_LENGTH, competition.description) &&
            lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, competition.organizator) &&
            lengthValidation(constants.MIN_CATEGORY_LENGTH, constants.MAX_CATEGORY_LENGTH, competition.category)) {
            return true;
        }

        return false;
    },
    isValidForumPost(forumPost) {
        if (lengthValidation(constants.MIN_TITLE_LENGTH, constants.MAX_TITLE_LENGTH, forumPost.title) &&
            lengthValidation(constants.MIN_DESCRIPTION_LENGTH, constants.MAX_DESCRIPTION_LENGTH, forumPost.description),
            lengthValidation(constants.MIN_NAME_LENGTH, constants.MAX_NAME_LENGTH, forumPost.user.username)) {
            return true;
        }

        return false;
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