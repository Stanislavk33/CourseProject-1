class User {
    constructor(params) {
        this._id = params.id;
        this.username = params.username;
        this.firstName = params.firstName;
        this.lastName = params.lastName;
        this.passHash = params.passHash;
        this.salt = params.salt;
        this.birthDate = params.birthDate;
        this.email = params.email;
        this.image = params.image;
        this.competitions = params.competitions;
        this.facebookId = params.facebookId;
        this.facebookToken = params.facebookToken;
        this.progress = params.progress;
        this.roles = params.roles;
    }
    save() {}

    isValidPassword() {}

    static find() {}
    static findOne() {}
    static findOneAndUpdate() {}
}

module.exports = User;