'use strict';

module.exports = ({ data }) => {
    return {
        search(req, res) {
            const body = req.body,
                searchName = req.query.search || '';

            data.filterCompetitions(searchName)
                .then((competitions) => {
                    competitions.forEach(x => {
                        x.passed = x.getPassed();
                    });
                    return res.status(200).render('competitions/searchpage', { result: { competitions, searchName, user: req.user } });
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        }

    };
};