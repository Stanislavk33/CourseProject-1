/* globals require describe it beforeEach afterEach */

const expect = require('chai').expect;
const sinonModule = require('sinon');

describe('Test auth controller', () => {
    let sinon;
    const data = {
        createUser: () => {}
    };
    const controller = require('../../server/controllers/auth-controller');
    const resMock = require('../mocks/res-mock');

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    describe('loadRegisterPage', () => {
        let response;
        const req = { user: { username: 'testuser' } };

        beforeEach(() => {
            response = resMock.createResponse();
        });

        it('Expect status to be (200) OK', done => {
            response.on('end', () => {
                expect(response.params.status).to.equal(200);
                done();
            });

            controller.loadRegisterPage(req, response);
        });

        it('Expect render url to be correct', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.equal('auth/register');
                done();
            });

            controller.loadRegisterPage(req, response);
        });
    });
});