/* globals require describe it beforeEach afterEach*/

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

        const competitionToBeAdded = {
            name: 'testName',
            place: "testPlace",
            organizator: "testOrganizator",
            category: 'testCategory',
            description: 'testDescription',
            points: 42,
            level: 'pro-tester',
            image: 'default-image'
        };

        it('Should reject when validation fail', done => {
            sinon.stub(validatorMock, 'validateCompetition', () => {
                return false;
            });

            data.createCompetition({})
                .then(() => {}).catch(() => {
                    done();
                });

            sinon.restore();
        });

        it('Should return competition with expected properties', done => {
            sinon.stub(validatorMock, 'validateCompetition', () => {
                return true;
            });

            sinon.stub(Competition.prototype, 'save', cb => {
                cb(null);
            });

            data.createCompetition(competitionToBeAdded)
                .then(competition => {
                    expect(competition.name).to.equal('testName');
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

        it('Should reject when save throw error', done => {
            sinon.stub(validatorMock, 'validateCompetition', () => {
                return true;
            });

            sinon.stub(Competition.prototype, 'save', cb => {
                cb({ error: 'error' });
            });

            data.createCompetition({})
                .then(() => {})
                .catch(() => {
                    done();
                });

            sinon.restore();
        });

        it('Expect validator to be called with correct competition', done => {
            sinon.stub(Competition.prototype, 'save', cb => {
                cb(null);
            });

            let calledCompetition;

            sinon.stub(validatorMock, 'validateCompetition', competition => {
                calledCompetition = competition;
                return true;
            });

            data.createCompetition(competitionToBeAdded)
                .then(_ => {
                    expect(calledCompetition).to.eql(competitionToBeAdded);
                    done();
                });

            sinon.restore();
        });

        it('Expect competition to be saved', done => {
            sinon.stub(validatorMock, 'validateCompetition', competition => {
                return true;
            });

            let saveIsCalled;
            sinon.stub(Competition.prototype, 'save', cb => {
                saveIsCalled = true;
                cb(null);
            });

            data.createCompetition(competitionToBeAdded)
                .then(_ => {
                    expect(saveIsCalled).to.be.true;
                    done();
                });
            sinon.restore();
        });
    });
    describe('Test updateCompetition(competitionId, update, null)', () => {
        const competitions = [{ _id: 0, likes: 1 }, { _id: 1, likes: 12 }];

        beforeEach(() => {
            sinon.stub(Competition, 'findOneAndUpdate', ({ _id }, update, options, cb) => {
                let competition = competitions.find(x => x._id === _id);
                competition.likes += update;
                console.log("jiasdijadsda");
                cb(null, competition);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Shoud find competition with provided id and increment the value of likes with 3', done => {
            data.updateCompetition(1, 3, null)
                .then(competition => {
                    expect(competition._id).to.be.equal(1);
                    expect(competition.likes).to.be.equal(15);
                    done();
                });
        })
    });

    describe('addJoinedUserToCompetition(competitionId, username)', () => {
        it('shoud call findOneAndUpdate with expected update, including the passed username of the addJoinedUsers', done => {

            let calledUpdate;
            sinon.stub(Competition, 'findOneAndUpdate', (filter, update, cb) => {
                calledUpdate = update;
                cb(null, null);
            });
            const username = 'Pesho';

            data.addJoinedUserToCompetition(1, username)
                .then(competition => {
                    expect(calledUpdate).to.eql({ $addToSet: { 'joinedUsers': { username, attended: false } } });
                    done();
                });

            sinon.restore();
        });

        it('shoud call findOneAndUpdate with expected filter, including id and username', done => {
            let calledFilter;
            sinon.stub(Competition, 'findOneAndUpdate', (filter, update, cb) => {
                calledFilter = filter;
                cb(null, null);
            });

            const username = 'Pesho';
            const passedId = 1;

            data.addJoinedUserToCompetition(passedId, username)
                .then(competition => {
                    expect(calledFilter).to.eql({ _id: passedId, 'joinedUsers.username': { $ne: username } });
                    done();
                });

            sinon.restore();
        });

        it('Expect to return correct competition', done => {
            const expectedCompetition = { _id: 1, name: 'First competition' };
            sinon.stub(Competition, 'findOneAndUpdate', (_, __, cb) => {
                cb(null, expectedCompetition)
            });

            data.addJoinedUserToCompetition(null, null)
                .then(actualCompetition => {
                    expect(expectedCompetition).to.eql(actualCompetition);
                    done();
                });

            sinon.restore();
        });

        it('Expect to reject when findOneAndUpdate to return error', done => {
            const errorMessage = 'addJoinedUsersToCompetition error';
            sinon.stub(Competition, 'findOneAndUpdate', (_, __, cb) => {
                cb({ err: errorMessage }, null);
            });

            data.addJoinedUserToCompetition(null, null)
                .catch(err => {
                    expect(err.err).to.be.equal(errorMessage);
                    done();
                });

            sinon.restore();
        });
    });

    describe('Test removeUsersFromCompetition', () => {

        it('Expect update to be called with expected filter', done => {
            let expectedFilter;
            sinon.stub(Competition, 'update', (filter, update, cb) => {
                expectedFilter = filter;
                cb(null, null);
            });

            const competitionId = 1;
            const username = 'Test user';
            data.removeUserFromCompetition(competitionId, username)
                .then(_ => {
                    expect(expectedFilter).to.be.eql({ _id: competitionId });
                    done();
                });

            sinon.restore();
        });

        it('Expect update to be called with expected update statement', done => {
            let expectedUpdate;
            sinon.stub(Competition, 'update', (filter, update, cb) => {
                expectedUpdate = update;
                cb(null, null);
            });

            const competitionId = 1;
            const username = 'Test user';
            data.removeUserFromCompetition(competitionId, username)
                .then(_ => {
                    expect(expectedUpdate).to.be.eql({ $pull: { "joinedUsers": { username } } });
                    done();
                });

            sinon.restore();
        });

        it('Expect to reject when update throw error', done => {
            const errorMessage = 'removeUserFromCompetition error';
            sinon.stub(Competition, 'update', (_, __, cb) => {

                cb({ err: errorMessage });
            });

            data.removeUserFromCompetition(null, null)
                .catch(err => {
                    expect(err.err).to.be.equal(errorMessage);
                    done();
                })
            sinon.restore();
        });

        it('Expect to return expected competition', done => {
            const expectedCompetition = { _id: 1, name: 'First competition' };

            sinon.stub(Competition, 'update', (_, __, cb) => {

                cb(null, expectedCompetition);
            });

            data.removeUserFromCompetition(null, null)
                .then(competition => {
                    expect(competition).to.be.eql(expectedCompetition);
                    done();
                })
                
            sinon.restore();
        });


    })
});
// removeUserFromCompetition(competitionId, username) {
//     return new Promise((resolve, reject) => {
//         Competition.update({ _id: competitionId }, { $pull: { "joinedUsers": { username } } }, (err, competition) => {
//             if (err) {
//                 return reject(err);
//             }

//             resolve(competition);
//         });
//     });
// },