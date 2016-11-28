'use strict';

module.exports = (data) => {
    return {
        search(req, res) {
            const body = req.body,
                params = req.query;
            console.log(body);
            console.log(params);
            // TODO:  validation
            data.filterCompetitions(params)
                .then((competitions) => {
                    return res.status(200).render('searchpage', { result: { competitions } });
                })
        }
    };
};