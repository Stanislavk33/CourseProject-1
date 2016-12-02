/* globals module require */
'use strict';

module.exports = function(models) {
    const Category = models.Category;

    return {
        getAllCategories() {
            return new Promise((resolve, reject) => {
                Category.find((err, categories) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(categories);
                });
            })
        },
        getCategoryById(_id) {
            return new Promise((resolve, reject) => {
                Category.findOne({ '_id': _id }, (err, category) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(category);
                });
            })
        },
        getCategoryByLink(link) {
            return new Promise((resolve, reject) => {
                Category.findOne({ 'link': link }, (err, category) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(category);
                });
            });
        },
        createCategory(category) {
            const newCategory = new Category({
                title: category.title,
                description: category.description,
                image: category.image,
                link: category.link,
                competitions: []
            });

            return new Promise((resolve, reject) => {
                newCategory.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newCategory);
                });
            });
        },
        addCompetitionToCategory(competition) {
            return new Promise((resolve, reject) => {
                console.log("before");
                const competitionToAdd = {
                    _id: competition._id,
                    name: competition.name,
                    status: competition.passed,
                    organizator: competition.organizator,
                    place: competition.place
                }
                Category.findOneAndUpdate({ 'title': competition.category }, { $push: { 'competitions': competitionToAdd } },
                    (err, category) => {
                        if (err) {
                            return reject(err);
                        }
                        console.log("DSA");
                        console.log(category);
                        return resolve(category);
                    })
            });
        }
    };
};