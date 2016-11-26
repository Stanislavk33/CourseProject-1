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
            res.status(200).render("create-competition", {
                result: ["hiking", "skiing", "swimming"]
            });
        },
        joinCompetition(req, res) {
            // TODO: post query to db
        },
        likes(req, res) {
            // TODO 
        },
        loadCompetitions(req, res) {
            data.getAllCompetitions()
                .then(competitions => {
                    res.render("competition-list", { res: competitions });
                });
        },
        createCompetition(req, res) {
            let body = req.body;
            let user = req.user.username;
            let keys = req.body.keys
                .split(" ")
                .filter(x => x !== "");

            data.createCompetition({
                    place: body.place,
                    organizator: user,
                    category: body.category,
                    points: body.points,
                    level: body.level,
                    keys: keys
                })
                .then(competition => {
                    res.redirect(`/competition/${competition._id}`);
                }).catch(err => {
                    console.log(err);
                });
        }
    };
};