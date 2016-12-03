/* globals require */
'use strict';

module.exports = ({ app, data, controllers, authentication, uploadCompetitionImage }) => {
    const controller = controllers.competitions;

        app.get('/competitions/', controller.loadCompetitions);
        app.get('/competitions/create',authentication.isInRole('normal'),/* authentication.isInRole('organizator')*/controller.getCreatePage);
        app.get('/competitions/:id', controller.getByID);
        app.put('/competitions/:id/like', authentication.isAuthenticated, controller.likeCompetition);
        app.put('/competitions/:id/dislike', authentication.isAuthenticated, controller.dislikeCompetition);
        app.put('/competitions/:id/join', authentication.isAuthenticated, controller.joinCompetition);
        app.put('/competitions/:id/leave', authentication.isAuthenticated, controller.leaveCompetition);

    // TODO
    // api/competiions/create
    app.post('/competitions/create', uploadCompetitionImage.single('competitionImage'), controller.createCompetition);
};