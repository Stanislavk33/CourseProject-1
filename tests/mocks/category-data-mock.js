class Category {
    constructor(params) {
        this.title = params.title;
        this.description = params.description;
        this.image = params.image;
        this.link = params.link;
        this.competitions = [];
    }

    save(){}

    static find() { }
    static findOne() { }
    static findOneAndUpdate() {}
};

module.exports = Category;