/* globals require describe it beforeEach afterEach */

const expect = require('chai').expect;
const sinonModule = require('sinon');

describe('Test forum controller', () => {
    let sinon;
    const data = {
        getForumPosts: () => { },
        getForumPostCount: () => { },
    };
    const controller = require('../../server/controllers/forum-controller')({ data });
    const resMock = require('../mocks/res-mock');

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    describe('loadForumPosts', () => {
        let response;
        const req = { user: { username: 'john' }, query: { page: 1 } };
        const forumPosts = [
            { title: 'Post1', description: 'Description1' },
            { title: 'Post2', description: 'Description2' },
            { title: 'Post3', description: 'Description3' }
        ];

        beforeEach(() => {
            sinon.stub(data, 'getForumPosts', () => {
                return Promise.resolve(forumPosts);
            });

            sinon.stub(data, 'getForumPostCount', () => {
                return Promise.resolve(forumPosts.length);
            });

            response = resMock.createResponse();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect status to be 200', done => {
            response.on('end', () => {
                expect(response.params.status).to.equal(200);
                done();
            });

            controller.loadForumPosts(req, response);
        });

        it('Expect render url to be correct', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.equal('forum/forum-page');
                done();
            });

            controller.loadForumPosts(req, response);
        });

        it('Expect render object to have posts and user', done => {
            response.on('end', () => {
                const actual = response.params.renderParameter;
                const expected = {
                        result: { forumPosts, user: req.user, params: { page: 1, pages: 1 } }
                    }

                expect(actual).to.eql(expected);
                done();
            });

            controller.loadForumPosts(req, response);

        });

        it('Expect if error to redirect to /500', done => {
            data.getForumPosts.restore();
            sinon.stub(data, 'getForumPosts', () => {
                return Promise.reject();
            });

            response.on('end', () => {
                expect(response.params.status).to.equal(500);
                expect(response.params.redirect).to.equal('/500');
                done();
            });

            controller.loadForumPosts(req, response);
        });
    });

    describe('getCreatePage', () => {
        let response;
        const req = {
            user: { username: 'john' }
        };

        beforeEach(() => {
            response = resMock.createResponse();
        });


        it('Expect status to be 200', done => {
            response.on('end', () => {
                expect(response.params.status).to.equal(200);
                done();
            });

            controller.getCreatePage(req, response);
        });

        it('Expect render url to be correct', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.equal('forum/create-forum-post');
                done();
            });

            controller.getCreatePage(req, response);
        });

        it('Expect render object to have user', done => {
            response.on('end', () => {
                const actual = response.params.renderParameter;
                const expected = { result: { user: req.user } };
                expect(actual).to.eql(expected);
                done();
            });

            controller.getCreatePage(req, response);
        });
    });
});