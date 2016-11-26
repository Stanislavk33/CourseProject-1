module.exports = (data) => {
    return {
        getByID(req, res) {
            const id = req.params.id;
            data.getCompetitionById(id)
                .then(competition => {
                    res.render("competition", { res: competition });
                });
        },
        getCreatePage(req, res) {
            // TODO: load competitions creation page
        },
        joinCompetition(req, res) {
            // TODO: post query to db
        },
        createCompetition(req, res) {
            // TODO 
        },
        loadCompetitions(req, res) {
            data.getAllCompetitions()
                .then(competitions => {
                    res.render("competition-list", { res: competitions });
                })
        },
        likes(req, res) {
            // TODO
        }
    }
}