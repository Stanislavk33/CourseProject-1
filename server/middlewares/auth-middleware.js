/* globals require */
'use strict';

module.exports = {
    isInRole(role) {
        return (req, res, next) => {
            if (req.user && req.user.roles.indexOf(role) != -1) {
                next();
            } else {
                res.status(401).redirect('/401');
            }
        }
    },
    isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401).redirect('/401');
        }
    },
    isSameUser(req,res,next){
        if (req.isAuthenticated() && req.user.username === req.params.username) {
            next();
        } else {
            res.status(401).redirect('/401');
        }
    }
}