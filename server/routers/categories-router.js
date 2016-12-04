'use strict';

module.exports = ({ app, controllers, authentication, uploadCategoryImage }) => {
        const controller = controllers.categories;

        app.get('/categories/', controller.loadCategories);
        app.get('/categories/create', authentication.isInRole('normal') /*authentication.isInRole('admin')*/ , controller.getCreateCategory);
        app.post('/categories/create', authentication.isInRole('normal') /*authentication.isInRole('admin')*/ , uploadCategoryImage.single('avatar'), controller.createCategory);
        app.get('/categories/:link', controller.getCategoryByTitle);
};