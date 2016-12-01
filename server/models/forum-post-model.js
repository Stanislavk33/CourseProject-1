'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    constants = require('../utilities/constants');

const forumPostSchema = new Schema({
    title: { type: String, required: true },
    description: {
        type: String,
        required: true,
        minlength: constants.MIN_DESCRIPTION_LENGTH,
        maxlength: constants.MAX_DESCRIPTION_LENGTH
    },
    user: {
        username: {
            type: String,
            required: true,
            minlength: constants.MIN_NAME_LENGTH
        },
        points: { type: String, required: true }
    },
    date: { type: Date, required: true },
    likes: { type: Number, required: true },
    usersLiked: [String],
    answers: [{
        content: {
            type: String,
            required: true,
            minlength: constants.MIN_FORUM_POST_ANSWER_LENGTH,
            maxlength: constants.MAX_FORUM_TITLE_LENGTH
        },
        user: {
            username: { type: String, required: true },
            points: { type: String, required: true }
        },
        date: { type: Date, required: true },
        likes: { type: Number, required: true },
        usersLiked: [String]
    }]
});

mongoose.model('ForumPost', forumPostSchema);

module.exports = mongoose.model('ForumPost');