/* globals require describe it */
'use strict';

const expect = require('chai').expect;
const sinonModule = require('sinon');

describe('Test Competition controller', () => {
    let sinon;
    const data = {
            getCompetitionById: () => {},
            getAllCategories: () => {}
        },
        controller = require('../../server/controllers/competitions-controller')({ data }),
        mocks = require('../mocks/res-mock');

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Test getCreatePage', () => {

        let response;
        const req = { user: { username: 'john' } };
        const competition = [
            { name: 'First competition', _id: 1 }
        ];
        const categories = [
            { title: 'Category1', description: 'Description1' },
            { title: 'Category2', description: 'Description2' },
            { title: 'Category3', description: 'Description3' }
        ];

        beforeEach(() => {
            sinon.stub(data, 'getAllCategories', () => {
                return Promise.resolve(categories);
            });

            response = mocks.createResponse();
        });

        afterEach(() => {
            sinon.restore();
        })
        it('Expect status to be 200', done => {

            controller.getCreatePage(req, response);

            response.on('end', () => {
                expect(response.params.status).to.equal(200);
                done();
            });
        });

        it('Expect render url to be correct', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.equal('competitions/create-competition');
                done();
            });

            controller.getCreatePage(req, response);
        });
    });
});