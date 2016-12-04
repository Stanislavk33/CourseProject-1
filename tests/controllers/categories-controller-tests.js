/* globals require describe it beforeEach afterEach */

const expect = require('chai').expect;
const sinonModule = require('sinon');

describe('Test categories controller', () => {
    let sinon;
    const data = {
        getAllCategories: () => { },
        getCategoryByLink: () => { },
        createCategory: () => { }
    };
    const controller = require('../../server/controllers/categories-controller')({ data });
    const resMock = require('../mocks/res-mock');

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    describe('loadCategories', () => {
        let response;
        const req = { user: { username: 'john' } };
        const categories = [
            { title: 'Category1', description: 'Description1' },
            { title: 'Category2', description: 'Description2' },
            { title: 'Category3', description: 'Description3' }
        ];

        beforeEach(() => {
            sinon.stub(data, 'getAllCategories', () => {
                return Promise.resolve(categories);
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

            controller.loadCategories(req, response);
        });

        it('Expect render url to be correct', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.equal('categories/categories');
                done();
            });

            controller.loadCategories(req, response);
        });

        it('Expect render object to have categories and user', done => {
            response.on('end', () => {
                const actual = response.params.renderParameter;
                const expected = { result: { categories, user: req.user } };
                expect(actual).to.eql(expected);
                done();
            });

            controller.loadCategories(req, response);

        });

        it('Expect if error to redirect to /500', done => {
            data.getAllCategories.restore();
            sinon.stub(data, 'getAllCategories', () => {
                return Promise.reject();
            });

            response.on('end', () => {
                expect(response.params.status).to.equal(500);
                expect(response.params.redirect).to.equal('/500');
                done();
            });

            controller.loadCategories(req, response);
        });
    });

    describe('getCategoryByTitle', () => {
        let response;
        const req = {
            user: { username: 'john' },
            params: { link: 'the-link' }
        };
        const category = { title: 'Category1', description: 'Description1',competitions: [{}] };
        let calledLink;

        beforeEach(() => {
            sinon.stub(data, 'getCategoryByLink', (link) => {
                calledLink = link;
                return Promise.resolve(category);
            });

            response = resMock.createResponse();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect data method to be called with correct link', done => {
            response.on('end', () => {
                expect(calledLink).to.equal(req.params.link);
                done();
            });

            controller.getCategoryByTitle(req, response);
        });

        it('Expect status to be 200', done => {
            response.on('end', () => {
                expect(response.params.status).to.equal(200);
                done();
            });

            controller.getCategoryByTitle(req, response);

        });

        it('Expect render url to be correct', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.equal('categories/category');
                done();
            });

            controller.getCategoryByTitle(req, response);

        });

        it('Expect render object to have category and user', done => {
            response.on('end', () => {
                const actual = response.params.renderParameter;
                const expected = { result: { category, user: req.user } };
                expect(actual).to.eql(expected);
                done();
            });

            controller.getCategoryByTitle(req, response);

        });

        it('Expect if error to redirect to /500', done => {
            data.getCategoryByLink.restore();
            sinon.stub(data, 'getCategoryByLink', () => {
                return Promise.reject();
            });

            response.on('end', () => {
                expect(response.params.status).to.equal(500);
                expect(response.params.redirect).to.equal('/500');
                done();
            });

            controller.getCategoryByTitle(req, response);

        });
    });

    describe('getCreateCategory', () => {
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

            controller.getCreateCategory(req, response);
        });

        it('Expect render url to be correct', done => {
            response.on('end', () => {
                expect(response.params.renderUrl).to.equal('categories/create-category');
                done();
            });

            controller.getCreateCategory(req, response);
        });

        it('Expect render object to have category and user', done => {
            response.on('end', () => {
                const actual = response.params.renderParameter;
                const expected = { result: { user: req.user } };
                expect(actual).to.eql(expected);
                done();
            });

            controller.getCreateCategory(req, response);
        });
    });

    describe('createCategory', () => {
        let response;
        const filename = '4328438927';
        const req = {
            user: { username: 'john' },
            body: {
                title: 'New category',
                description: 'This is a very new category',
            },
            file: { filename }
        };

        const category = { title: 'Category1', description: 'Description1' };
        let calledCategory;

        beforeEach(() => {
            sinon.stub(data, 'createCategory', (param) => {
                calledCategory = param;
                return Promise.resolve(param);
            });

            response = resMock.createResponse();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect data method to be called with correct category', done => {
            response.on('end', () => {
                const expected = {
                    title: req.body.title,
                    description: req.body.description,
                    image: req.file.filename ,
                    link: req.body.title.replace(' ', '-').toLowerCase()
                }
                expect(calledCategory).to.eql(expected);
                done();
            });

            controller.createCategory(req, response);
        });

         it('Expect data method to be called with correct category - file name null when no found', done => {
            req.file = null;

            response.on('end', () => {
                const expected = {
                    title: req.body.title,
                    description: req.body.description,
                    image: null,
                    link: req.body.title.replace(' ', '-').toLowerCase()
                }
                expect(calledCategory).to.eql(expected);

                req.file = {filename};
                
                done();
            });

            controller.createCategory(req, response);
        });

        it('Expect redirect url to be correct', done => {
            response.on('end', () => {
                expect(response.params.redirect).to.equal('/categories/new-category');
                done();
            });

            controller.createCategory(req, response);
        });

        it('Expect if error to redirect to /500', done => {
            data.createCategory.restore();
            sinon.stub(data, 'createCategory', ()=>{
                return Promise.reject();
            })

           response.on('end', () => {
                expect(response.params.status).to.equal(500);
                expect(response.params.redirect).to.equal('/500');
                done();
            });

            controller.createCategory(req, response);
        });
    });
});