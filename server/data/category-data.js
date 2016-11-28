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
        getCategoriesByTitle(title) {
            return new Promise((resolve, reject) => {
                Category.find({ 'title': title }, (err, categories) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(categories);
                });
            });
        },
        createCategory(category) {
            const newCategory = new Category({
                title: category.title,
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
        addCompetitionToCategory(categoryId, competition) { //competition object is created in the controller
            return new Promise((resolve, reject) => {
                Category.findByIdAndUpdate({ '_id': categoryId }, { $push: { 'competitions': competition } },
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    })
            });
        }
    };
};