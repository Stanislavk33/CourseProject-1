'use strict';

module.exports = (data) => {
    return {
        loadCategories(req, res) {
            data.getAllCategories()
                .then((categories)=>{
                    return res.status(200).render('categories', {result: {categories}});
                })
                .catch(err=>{
                    res.status(500).render('error');
                });
        },
        getCategoryByTitle(req, res){
            const title = req.params.title;
            data.getCategoriesByTitle(title)
                .then(category => {
                    return res.status(200).render('category', {result: category});
                })
                .catch(err=>{
                    res.status(500).render('error');
                })
        }
    }
};