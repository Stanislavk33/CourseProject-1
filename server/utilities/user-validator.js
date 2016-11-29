'use strict';

module.exports = {
    isAdminUserMiddleware(req, res, next) {
        if (!req.user || req.user.roles.indexOf("admin") === -1) {
            res.redirect("/users/login");
        } else {
            next();
        }
    },

    isInRole(user, role) {
        if (user.roles.includes(role)) {
            return true;
        }

        return false;
    },

    isUserLoggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect("/auth/login");
        }
    }
};