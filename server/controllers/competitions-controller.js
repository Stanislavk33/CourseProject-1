module.exports = (data) => {
    return {
        getByID(req, res) {
            const id = req.params.id;
            data.getCompetitionById(id)
                .then(competition => {
                    res.render("competition", { result: competition });
                });
        },
        getCreatePage(req, res) {
            return res.status(200).render("create-competition", {
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
                    res.render("competition-list", { result: competitions });
                });
        },
        createCompetition(req, res) {
            let body = req.body;
            let user = "admin"; // req.user.username 
            let keys = body.keys
                .split(" ")
                .filter(x => x !== "");

            data.createCompetition({
                    name:body.name,
                    place: body.place,
                    organizator: user,
                    category: body.category,
                    points: body.points,
                    level: body.level,
                    startDate: body.startDate,
                    endDate: body.endDate,
                    keys: keys,
                    location: { longitude: body.longitude, latitude: body.latitude }
                })
                .then(competition => {
                    res.redirect(`/competitions/${competition._id}`);
                }).catch(err => {
                    console.log(err);
                });
        }
    };
};