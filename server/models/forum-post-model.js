'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const forumPostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: {
        username: { type: String, required: true },
        points: { type: String, required: true }
    },
    date: { type: Date, required: true },
    likes: { type: Number, required: true },
    usersLiked: [String],
    answers: [{
        content: { type: String, required: true },
        user: {
            username: { type: String, required: true },
            points: { type: String, required: true }
        },
        date: { type: Date, required: true },
        likes: { type: Number, required: true }
    }]
});

mongoose.model('ForumPost', forumPostSchema);

module.exports = mongoose.model('ForumPost');