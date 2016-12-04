'use strict';

module.exports = ({data}) => {
    return {
        getHome(req, res) {
            Promise.all([
                data.getLatestUpcommingCompetitions(),
                data.getMostPopularCompetitions(),
                data.getTopUsers(),
                data.getAllCategories()
            ])
                .then(([upcommingCompetitions, topCompetitions, topUsers, categories]) => {
                    res.render('home-page', {
                        result: {
                            upcommingCompetitions,
                            topCompetitions,
                            topUsers,
                            categories,
                            user: req.user
                        }
                    })
                })
                .catch((err) => {
                    res.status(500).redirect('/500');
                });
        }
    }
};