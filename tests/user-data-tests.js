/* globals require describe it beforeEach afterEach*/

const expect = require("chai").expect;
const sinonModule = require("sinon");

describe("User data tests", () => {
    let sinon;
    let User = require('./mocks/user-data-mock');
    let Validator = require('./mocks/validator-mock');
    let data = require('../server/data/user-data')({ User }, Validator);


    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    describe('getUserById(id)', () => {
        let existingUserId = 1;

        let user = {
            _id: existingUserId,
            username: 'TestUser'
        };

        let users = [user];

        beforeEach(() => {
            sinon.stub(User, "findOne", (query, cb) => {
                let id = query._id;
                let foundUser = users.find(user => user._id === id);
                cb(null, foundUser);
            });
        });

        afterEach(() => {
            sinon.restore()
        });

        it('Expect to return user by given id', (done) => {
            data.getUserById(existingUserId)
                .then((actualUser) => {
                    expect(actualUser).to.equal(user);
                })
                .then(done, done);
        });

        it('Expect to return null when the user is not found', (done) => {
            data.getUserById(10)
                .then((foundUser) => {
                    expect(foundUser).to.be.null;
                }).then(done, done);
        });
    });

    describe('getAllUsers()', () => {
        it('Expect to return 3 users', done => {
            let users = ['ElenaZarkova', 'MartinYotov', 'SilviyaBoteva'];
            sinon.stub(User, 'find', cb => {
                cb(null, users);
            });

            data.getAllUsers()
                .then(actualUsers => {
                    expect(actualUsers).to.equal(users);
                    done();
                });
        });
    });

    // describe('getTopUsers()', () => {
    //     it('Expect to return top user', done => {
    //         //Arrange
    //         let users = 'Silviya';
    //         sinon.stub(User, 'find', cb => {
    //             cb(null, users);
    //         });

    //         //Act
    //         data.getTopUsers()
    //             .then(actualUsers => {
    //                 //Assert
    //                 expect(actualUsers).to.equal(users);
    //             })
    //             .then(done, done);
    //     });
    // });

    describe('getUserByUsername(username, asPersonalPage)', () => {
        let existingUsername = 'Silviya';
        let existingCompetition = [];

        let user = {
            username: existingUsername,
            competitions: existingCompetition
        };

        let users = [user];

        beforeEach(() => {
            sinon.stub(User, 'findOne', (query, cb) => {
                let username = query.username;
                let competitions = query.competitions;

                let foundUser = users.find(u => u.username === username);
                cb(null, foundUser);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return user by given username', (done) => {
            data.getUserByUsername(existingUsername)
                .then((foundUser) => {
                    expect(foundUser).to.equal(user);
                })
                .then(done, done);
        });
    });

    describe('createUser(user)', () => {
        it('Expect to reject when validation fail', done => {
            sinon.stub(Validator, 'isValidUser', () => {
                return false;
            });

            data.createUser({})
                .then(() => {})
                .catch(() => {
                    done();
                });

            sinon.restore();
        });
    });

    describe('updateUserInformation(username, newInfo)', () => {
        const users = [{ username: 'testusername' }];
        const newInfo = 'newUsername';
        beforeEach(() => {
            sinon.stub(User, 'findOneAndUpdate', 'someuser', cb => {
                const user = users.find(x => x.username === username);
                user.username = newInfo;
                return user;
            });

            afterEach(() => {
                sinon.restore();
            });
            it('Should update user info', done => {
                data.updateUserInformation('testusername', 'newUsername')
                    .then(user => {
                        expect(user.username).to.be.equal.to('newUsername');
                        done();
                    })
            });
        })
    });
})