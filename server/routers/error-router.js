'use strict';

module.exports = ({ app }) => {

    app.get('/401', function(req, res) {
        res.status(401).render('error-page-401');
        })
        app.get('/404', function(req, res) {
            res.status(404).render('error-page-404');
        })
        app.get('/500', function(req, res) {
            res.status(500).render('error-page-500');
        });
};