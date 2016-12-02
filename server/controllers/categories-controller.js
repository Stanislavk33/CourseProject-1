'use strict';

module.exports = (data) => {
    return {
        loadCategories(req, res) {
            data.getAllCategories()
                .then((categories) => {
                    return res.status(200).render('categories', { result: { categories, user: req.user } });
                })
                .catch(err => {
                    res.status(500).redirect('/500');
                });
        },
        getCategoryByTitle(req, res) {
            const link = req.params.link;
            data.getCategoryByLink(link)
                .then(category => {
                    return res.status(200).render('category', { result: category, user: req.user });
                })
                .catch(err => {
                    res.status(500).redirect('/500');
                })
        }
    }
};