class ForumPost {
    constructor(params) {
        this._id = params.id;
        this.title = params.title;
        this.description = params.description;
        this.user = params.user;
        this.date = params.date;
        this.likes = params.likes;
        this.usersLiked = params.usersLiked;
        this.answers = params.answers;
    }
    save() {}

    static find() {}
    static findOne() {}
    static findByIdAndUpdate() {}
    static count() {}
}

module.exports = ForumPost;