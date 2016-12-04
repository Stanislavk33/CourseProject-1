const expect = require("chai").expect,
    sinonModule = require("sinon"),
    Competition = require('./mocks/competition-data-mock'),
    validatorMock = require('./mocks/validator-mock'),
    data = require('../server/data/competition-data')({ Competition }, validatorMock);

describe('Test competition data', () => {
    let sinon;

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    describe('Test getAllCompetitions(page, size)', () => {
        const competitions = ['First competition', 'Second competition', 'Third competition', 'Fourth competition'];

        //require data

        beforeEach(() => {
            sinon.stub(Competition, 'find', ({}, {}, { sort, limit, skip }, cb) => {
                const foundCompetitions = competitions.slice(skip, skip + limit);
                cb(null, foundCompetitions)
            });
        });

        afterEach(() => {
            sinon.restore()
        });


        it('Expect to return 3 competitions', done => {
            const expectedCompetitions = ['First competition', 'Second competition', 'Third competition'];

            data.getAllCompetitions(1, 3)
                .then(actualCompetitions => {
                    expect(actualCompetitions).to.eql(expectedCompetitions);
                    done();
                });
        });

        it('Expect to return 1 competitio - the last from competitions list', done => {
            const expectedCompetitions = ['Fourth competition'];

            data.getAllCompetitions(2, 3)
                .then(actualCompetitions => {
                    expect(actualCompetitions).to.eql(expectedCompetitions);
                    done();
                });
        });
    });

    describe('Test getCompetitionById()', () => {
        const competitionsWithId = [{ name: 'First', id: 1 }, { name: 'Second', id: 2 }];

        beforeEach(() => {
            sinon.stub(Competition, 'findOne', ({ _id }, cb) => {
                const competition = competitionsWithId.find(competition => competition.id === _id);

                cb(null, competition);
            })
        });

        afterEach(() => {
            sinon.restore()
        });

        it('Expect getCompetitionById to return 1 competition', done => {
            const expectedCompetitions = { name: 'First', id: 1 };
            data.getCompetitionById(1)
                .then(actualCompetition => {
                    expect(actualCompetition).to.eql(expectedCompetitions);
                    done();
                });
        });
        it('Expect getCompetitionById to return null when there is no competition with provided id', done => {
            data.getCompetitionById(3)
                .then(actualCompetition => {
                    expect(actualCompetition).to.eql(null);
                    done();
                });
        });
    });

    describe('Test createCompetition(competition)', () => {
        it('Shoud reject when validation fail', done => {
            sinon.stub(validatorMock, 'validateCompetition', (competition) => {
                return false;
            });

            data.createCompetition({})
                .then(_ => {}).catch(err => {
                    done();
                });

            sinon.restore();
        });

        it('Shoud return competition with expected properties', done => {
            sinon.stub(validatorMock, 'validateCompetition', (competition) => {
                return true;
            });

            sinon.stub(Competition.prototype, 'save', cb => {
                cb(null);
            });

            data.createCompetition({
                    place: "testPlace",
                    organizator: "testOrganizator",
                    category: 'testCategory',
                    description: 'testDescription',
                    points: 42,
                    level: 'pro-tester',
                    image: 'default-image'
                })
                .then(competition => {
                    expect(competition.place).to.equal('testPlace');
                    expect(competition.organizator).to.equal('testOrganizator');
                    expect(competition.category).to.equal('testCategory');
                    expect(competition.description).to.equal('testDescription');
                    expect(competition.level).to.equal('pro-tester');
                    expect(competition.points).to.equal(42);
                    expect(competition.image).to.equal('default-image');
                    done();
                });

            sinon.restore();
        });

        it('Shoud reject when save throw error', done => {
            sinon.stub(validatorMock, 'validateCompetition', (competition) => {
                return true;
            });
            sinon.stub(Competition.prototype, 'save', cb => {

                return (error);
            });

            data.createCompetition({})
                .then(_ => {})
                .catch(err => {
                    done();
                });
        });
    });

    describe('Test updateCompetition(competitionId, update, null)', () => {
        const competitions = [{ _id: 0, likes: 1 }, { _id: 1, likes: 12 }];
        beforeEach(() => {
            sinon.stub(Competition, 'findOneAndUpdate', { _id }, update, options, cb => {
                let competition = competitions.find(x => x._id === _id);
                competition.likes += update;

                return competition;
            });

            afterEach(() => {
                sinon.restore();
            });

            it('Shoud find competition with provided id and increment the value of likes with 3', done => {
                data.updateCompetition(1, 3, null)
                    .then(competition => {

                        expect(competition._id).to.be.equal.to(1);
                        expect(competition.likes).to.be.equal.to(15);
                        done();
                    })
            })
        })
    });


})