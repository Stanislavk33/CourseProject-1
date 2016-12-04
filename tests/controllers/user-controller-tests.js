<<<<<<< HEAD
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

    describe('getProfile tests', () => {
        let response;
        let req = {
            params: {
                username: 'testUsername'
            },
            user: {
                username: 'testUsername'
            },
            isAuthenticated: () => { }
        };

        beforeEach(() => {
            sinon.stub(data, 'getUserByUsername', () => {
                return Promise.resolve(req.user, true);
            });
            sinon.stub(req, 'isAuthenticated', () => {
                return Promise.resolve(req.user);
            })

            response = resMock.createResponse();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect res.status() to return 200', done => {
            response.on('end', () => {
                expect(response.params.status).to.be.equal(200);
                done();
            });

            controller.getProfile(req, response);
        });

        it('Expect res.render() to return correct url', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.be.equal('users/personal-profile');
                done();
            });

            controller.getProfile(req, response);
        });

    });
});
