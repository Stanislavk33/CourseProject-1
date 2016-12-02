'use strict';

const express = require('express');

module.exports = ({ app }) => {
    const router = new express.Router();

    router.get('*', function (req, res) {
        res.status(404).render('error-page-404');
    });

    app.use('/', router);
};