class CompetitionMock {
    constructor(params) {
        this._id = params.id;
        this.name = params.name;
        this.place = params.place;
        this.likes = params.likes;
        this.organizator = params.organizator;
        this.category = params.category;
        this.description = params.description;
        this.joinedUsers = params.joinedUsers;
        this.startDate = params.startDate;
        this.endDate = params.endDate;
        this.image = params.image;
        this.points = params.points;
        this.level = params.level;
        this.usersLiked = params.usersLiked;
    }
    save() {}

    isValidPassword() {}

    static find() {}
    static findOne() {}
}

module.exports = CompetitionMock;