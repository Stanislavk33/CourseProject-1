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
                    return res.status(200).render('category', { result: { category, user: req.user } });
                })
                .catch(err => {
                    res.status(500).redirect('/500');
                })
        },
        getCreateCategory(req, res) {
            return res.status(200).render('create-category', { result: { user: req.user } });
        },
        createCategory(req, res) {
            let body = req.body;

            data.createCategory({
                    title: body.title,
                    description: body.description,
                    image: req.file ? req.file.filename : null
                })
                .then(category => {
                    res.redirect(`/categories/${category._id}`);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).redirect('/500');
                });
        }
    };
};