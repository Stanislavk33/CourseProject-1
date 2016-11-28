'use strict';

module.exports = (data) => {
    return {
        getHome(req, res) {
            Promise.all([
                data.getLatestUpcommingCompetitions(),
                 data.getMostPopularCompetitions(),
                 data.getTopUsers(),
                 data.getAllCategories()
                 ])
                .then(([upcommingCompetition, mostPopularCompetition, topUsers, categories]) => {

                    res.render('home-page', {
                        result: {
                            upcommingCompetition,
                            mostPopularCompetition,
                            topUsers,
                            categories
                        }
                    })
                });
        }
    }
};