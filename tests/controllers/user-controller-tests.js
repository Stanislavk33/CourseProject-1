/* globals require describe it beforeEach afterEach */

const expect = require('chai').expect;
const sinonModule = require('sinon');

describe('Test user controller', () => {
    let sinon;

    const data = {
        getUserByUsername: () => { },
        updateUserInformation: () => { },
        getUserById: () => { },
        updatePoints: () => { },
        searchUsersByName: () => { },
        getCountOfFilteredUsers: () => { },
        updateAttendedStatusToUser: () => { },
    };

    let controller = require('./../../server/controllers/user-controller')({ data });
    const resMock = require('./../mocks/res-mock');

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    let response;
    let req = {
        params: {
            username: 'testUsername'
        },
        user: {
            username: 'testUsername'
        },
        params: {
            username: 'testName'
        },
        userInfo: {
            username: 'testUsername',
            points: 13,
            firstName: 'testFirstName'

        },
        isAuthenticated: () => { }
    };

    beforeEach(() => {
        sinon.stub(data, 'getUserByUsername', () => {
            return Promise.resolve(req.userInfo, true);
        });

        response = resMock.createResponse();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getProfile tests', () => {
        it('Expect res.status() to return 200 if correct data is passed', done => {
            response.on('end', () => {
                expect(response.params.status).to.be.equal(200);
                done();
            });

            controller.getProfile(req, response);
        });

        it('Expect res.render() to return correct pug if not the same user', done => {
            sinon.stub(req, 'isAuthenticated', () => {
                return Promise.resolve(req.anotherUser);
            });

            response.on('end', () => {
                expect(response.params.renderUrl).to.be.equal('users/user-profile');
                done();
            });

            controller.getProfile(req, response);
        });

        it('Expect res.render() to return correct pug if the same user', done => {
            sinon.stub(req, 'isAuthenticated', () => {
                return Promise.resolve(req.user);
            });

            response.on('end', () => {
                expect(response.params.renderUrl).to.be.equal('users/user-profile');
                done();
            });

            controller.getProfile(req, response);
        });

        it('Expect res.render() to return object with correct user information', done => {
            sinon.stub(req, 'isAuthenticated', () => {
                return Promise.resolve(req.user);
            });

            response.on('end', () => {
                const actual = response.params.renderParameter;
                const expected = {
                    result: { userForProfile: req.userInfo, user: req.user }
                };

                expect(actual).to.eql(expected);
                done();
            });

            controller.getProfile(req, response);
        });
    });

    describe('getEditPage tests', () => {
        it('Expect res.render() to return 200 if correct data is passed', done => {
            response.on('end', () => {
                expect(response.params.status).to.be.eql(200);
                done();
            })

            controller.getEditPage(req, response);
        });

        it('Expect res.render() to be called with correct Url', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.be.eql('users/edit-profile');
                done();
            })

            controller.getEditPage(req, response);
        });

        it('Expect res.render() with correct user information to be called', done => {
            response.on('end', () => {
                const actual = response.params.renderParameter;
                const expected = { result: { user: req.user } };
                expect(actual).to.eql(expected);
                done();
            });

            controller.getEditPage(req, response);
        })
    });
});
