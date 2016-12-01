'use strict';

module.exports = (data) => {
    return {
        search(req, res) {
            const body = req.body,
                searchName = req.query.search || '';

            data.filterCompetitions(searchName)
                .then((competitions) => {
                    return res.status(200).render('searchpage', { result: { competitions, searchName, user: req.user } });
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
                    return res.status(200).render('searchpage', { result: { users, user: req.user } });
                }, err => {
                    console.log(err);
                });
        }
    };
};