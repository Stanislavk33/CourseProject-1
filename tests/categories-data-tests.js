/* globals require describe it*/

const expect = require('chai').expect;
const sinonModule = require('sinon');


describe('Test categories data', () => {
    let sinon;
    let CategoryMock = require('./mocks/category-data-mock');
    let validatorMock = require('./mocks/validator-mock');
    let data = require('../server/data/category-data')({ Category: CategoryMock }, validatorMock);

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    describe('getAllCategories()', () => {
        let categories = [
            { title: 'Category1', description: 'Description1' },
            { title: 'Category2', description: 'Description2' },
            { title: 'Category3', description: 'Description3' }
        ];


        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return all categories", done => {
            sinon.stub(CategoryMock, "find", cb => {
                cb(null, categories);
            });

            data.getAllCategories()
                .then(returnedCategories => {
                    expect(returnedCategories).to.eql(categories);
                    done();
                });
        });

        it("Expect to return no categories when there are none", done => {
            sinon.stub(CategoryMock, "find", cb => {
                cb(null, []);
            });

            data.getAllCategories()
                .then(returnedCategories => {
                    expect(returnedCategories).to.eql([]);
                    done();
                });
        });

        it("Expect to reject error, when such is thrown", done => {
            sinon.stub(CategoryMock, "find", cb => {
                cb({ err: 'Category find error' }, []);
            });

            data.getAllCategories()
                .then(returnedCategories => {
                })
                .catch((err) => {
                    expect(err.err).to.equal('Category find error');
                    done();
                });
        });
    });

    describe('getCategoryByLink(link)', () => {
        let category = { title: 'Category1', description: 'Description1', link: 'category1' };

        afterEach(() => {
            sinon.restore();
        });

        it("Expect to return the category", done => {
            sinon.stub(CategoryMock, "findOne", (query, cb) => {
                cb(null, category);
            });

            data.getCategoryByLink('link1')
                .then(returnedCategory => {
                    expect(returnedCategory).to.eql(category);
                    done();
                });
        });

        it("Expect to call method with correct parameter", done => {
            let link = '414532525';
            let receivedLink;
            sinon.stub(CategoryMock, "findOne", (query, cb) => {
                receivedLink = query.link;
                cb(null, category);
            });

            data.getCategoryByLink(link)
                .then(returnedCategories => {
                    expect(receivedLink).to.equal(link);
                    done();
                });
        });

        it("Expect to return null when there is no category", done => {
            sinon.stub(CategoryMock, "findOne", (query, cb) => {
                cb(null, null);
            });

            data.getCategoryByLink()
                .then(returnedCategories => {
                    expect(returnedCategories).to.eql(null);
                    done();
                });
        });

        it("Expect to reject error, when such is thrown", done => {
            sinon.stub(CategoryMock, "findOne", (query,cb) => {
                cb({ err: 'Category find one error' }, null);
            });

            data.getCategoryByLink('link')
                .catch(err => {
                    expect(err.err).to.equal('Category find one error');
                    done();
                });
        });
    });

    describe('createCategory(category)', () => {
        const category = {
            title: 'Board Games',
            description: 'very cool',
            image: '214325436',
            link: 'board-games'
        };

        beforeEach(() => {
            sinon.stub(CategoryMock.prototype, "save", cb => {
                cb(null);
            });

            sinon.stub(validatorMock, 'isValidCategory', category => {
                return true;
            });
        })

        afterEach(() => {
            sinon.restore();
        })

        it('Expect validator to be called with correct category', done => {
            validatorMock.isValidCategory.restore();
            let calledCategory;

            sinon.stub(validatorMock, 'isValidCategory', category => {
                calledCategory = category;
                return true;
            });

            data.createCategory(category)
                .then(() => {
                    expect(calledCategory).to.eql(category);
                    done();
                })
        });

        it('Expect to reject if validation fails', done => {
            validatorMock.isValidCategory.restore();

            sinon.stub(validatorMock, 'isValidCategory', category => {
                return false;
            });

            data.createCategory(category)
                .catch(err => {
                    expect(err.err).to.equal('Category information is not correct');
                    done();
                })
        });

        it('Expect constructor to be called with correct category', done => {
            data.createCategory(category)
                .then(newCategory => {
                    expect(newCategory.title).to.equal(category.title);
                    expect(newCategory.description).to.equal(category.description);
                    expect(newCategory.image).to.equal(category.image);
                    expect(newCategory.link).to.equal(category.link);
                    expect(newCategory.competitions).to.eql([]);
                    done();
                })
        });

        it('Expect category to be saved', done => {
            CategoryMock.prototype.save.restore();

            let saveIsCalled;
            sinon.stub(CategoryMock.prototype, "save", cb => {
                saveIsCalled = true;
                cb(null);
            });

            data.createCategory(category)
                .then(newCategory => {
                    expect(saveIsCalled).to.be.true;
                    done();
                });
        });

        it('Expect to reject if err', done => {
            CategoryMock.prototype.save.restore();

            sinon.stub(CategoryMock.prototype, "save", cb => {
                cb({ err: 'Category not saved' });
            });

            data.createCategory(category)
                .catch(err => {
                    expect(err.err).to.equal('Category not saved');
                    done();
                });
        });
    });

    describe('addCompetitionToCategory(competiton)', () => {
        const competition = {
            _id: '32434665474',
            name: 'Competitions',
            passed: 'passed',
            organizator: 'username',
            place: 'Sofia',
            category: 'Hiking'
        }

        afterEach(() => {
            sinon.restore();
        })

        it('Expect findOneAndUpdate to be called with correct filter', done => {
            let calledFilter;
            sinon.stub(CategoryMock, 'findOneAndUpdate', (filter, update, cb) => {
                calledFilter = filter;
                cb(null, null);
            });

            data.addCompetitionToCategory(competition)
                .then(category => {
                    expect(calledFilter).to.eql({ 'title': competition.category });
                    done();
                });
        });

        it('Expect findOneAndUpdate to be called with correct update', done => {
            let calledUpdate;
            sinon.stub(CategoryMock, 'findOneAndUpdate', (filter, update, cb) => {
                calledUpdate = update;
                cb(null, null);
            });

            data.addCompetitionToCategory(competition)
                .then(category => {
                    const newCompetition = {
                        _id: competition._id,
                        name: competition.name,
                        status: competition.passed,
                        organizator: competition.organizator,
                        place: competition.place
                    };
                    expect(calledUpdate).to.eql({ $push: { 'competitions': newCompetition } });
                    done();
                });
        });

        it('Expect to return competition', done => {
            let category = { title: 'Category1', description: 'Description' };
            sinon.stub(CategoryMock, 'findOneAndUpdate', (filter, update, cb) => {
                cb(null, category);
            });

            data.addCompetitionToCategory(competition)
                .then(returnedCompetition => {
                    expect(returnedCompetition).to.eql(competition);
                    done();
                });
        });

        it('Expect to reject if error', done => {
            let category = { title: 'Category1', description: 'Description' };
            sinon.stub(CategoryMock, 'findOneAndUpdate', (filter, update, cb) => {
                cb({ err: 'Competitions not added' }, category);
            });

            data.addCompetitionToCategory(competition)
                .catch(err => {
                    expect(err.err).to.equal('Competitions not added');
                    done();
                });
        });
    });
});