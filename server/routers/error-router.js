'use strict';

const express = require('express');

module.exports = ({ app }) => {
    const router = new express.Router();

    router.get('/401', function(req, res) {
        res.status(401).render('error-page-401');
        })
        .get('/404', function(req, res) {
            res.status(404).render('error-page-404');
        })
        .get('/500', function(req, res) {
            res.status(500).render('error-page-500');
        });

    app.use('/', router);
};