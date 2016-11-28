module.exports = (data) => {
    return {
        loadRegisterPage(req, res) {
            //TODO
        },
        loadLoginPage(req, res) {
            // TODO
        },
        getById(req, res) {
            data.getUserById(req.params.id)
                .then(user => {
                    if (user === null) {
                        return res.status(400)
                            .redirect('/error');
                    }

                    // TODO: return res.render...
                });
        },
        addPoints(req, res) {
            const username = req.body.username;
            const points = req.body.points;
            const category = req.body.category;

            data.updatePoints(username, points, category)
                .then(user => {
                    if (user === null) {
                        return res.status(400)
                            .redirect('/error');
                    }
                })
        },
        create(req, res) {
            // TODO
        },
        login(req, res) {
            // TODO
        },
        logout(req, res) {
            // TODO
        }
    }
}