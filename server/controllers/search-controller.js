'use strict';

module.exports = (data) => {
    return {
        search(req, res) {
            const body = req.body,
                params = req.query;
            console.log(body);
            console.log(params);
            // TODO:  validation
            data.filterCompetitions(params)
                .then((competitions) => {
                    return res.status(200).render('searchpage', { result: { competitions } });
                })
        },
        searchUser(username, isLoggedIn, req, res) {
            let user = req.user;
            if (user) {
                user.isAdmin = req.user.roles.indexOf("admin") !== -1;
            }

            //"i" case-insensitive
            let query = { username: new RegExp(username, "i") };
            data.findUserWithIdAndName(query)
                .then((users) => {
                    return res.status(200).render('searchpage', { result: { users } });
                }, err => {
                    console.log(err);
                });
        }
    };
};