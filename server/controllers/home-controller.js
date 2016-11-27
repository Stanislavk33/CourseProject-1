module.exports = (data) => {
    return {
        getHome(req, res) {
            Promise.all([
                data.getLatestUpcommingCompetitions(),
                 data.getMostPopularCompetitions(),
                 data.getTopUsers()
                 ])
                .then(([upcommingCompetition, mostPopularCompetition, topUsers]) => {

                    res.render("home-page", {
                        result: {
                            upcommingCompetition,
                            mostPopularCompetition,
                            topUsers
                        }
                    })
                });
        }
    }
};