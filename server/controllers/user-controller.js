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
                    if(user === null)
                    {
                        return res.status(400)
                            .redirect('/error');
                    }

                    // TODO: return res.render...
                });
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