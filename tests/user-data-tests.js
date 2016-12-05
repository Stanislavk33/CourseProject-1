/* globals require describe it beforeEach afterEach*/

const expect = require("chai").expect;
const sinonModule = require("sinon");

describe("Test users data ", () => {
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
        const users = [
            { username: 'TestUsername' }
        ];

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return all users', done => {
            sinon.stub(User, 'find', cb => {
                cb(null, users);
            });

            data.getAllUsers()
                .then(returnedUsers => {
                    expect(returnedUsers).to.equal(users);
                    done();
                });
        });

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

        it('Expect to return no users when are none', done => {
            sinon.stub(User, "find", cb => {
                cb(null, []);
            });

            data.getAllUsers()
                .then(returnedUsers => {
                    expect(returnedUsers).to.eql([]);
                    done();
                });
        });

        it("Expect to reject error, when such is thrown", done => {
            sinon.stub(User, "find", cb => {
                cb({ err: 'User find error' }, []);
            });

            data.getAllUsers()
                .catch((err) => {
                    expect(err.err).to.equal('User find error');
                    done();
                });
        });
    });

    describe('getTopUsers()', () => {

        let users = ['TestUser', 'TestUser2'];

        beforeEach(() => {
            sinon.stub(User, "find", ({}, {}, { limit, sort }, cb) => {
                let foundUser = users.slice(0, limit);
                cb(null, foundUser);
            });
        });

        afterEach(() => {
            sinon.restore()
        });

        it('Expect to return the first 2 users', done => {
            //Arrange
            let expectedUsers = ['TestUser', 'TestUser2'];

            //Act
            data.getTopUsers()
                .then(actualUsers => {
                    //Assert
                    expect(actualUsers).to.eql(expectedUsers);
                })
                .then(done, done);
        });
    });

    describe('getUserByUsername(username, asPersonalPage)', () => {
        let existingUsername = 'Silviya';
        let existingCompetition = [];

        let user = {
            username: existingUsername,
            competitions: existingCompetition
        };

        let users = [user];

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return user by given username', (done) => {
            sinon.stub(User, 'findOne', (query, cb) => {
                let username = query.username;

                let foundUser = users.find(u => u.username === username);
                cb(null, foundUser);
            });

            data.getUserByUsername(existingUsername)
                .then((foundUser) => {
                    expect(foundUser).to.equal(user);
                })
                .then(done, done);
        });

        it("Expect to reject error, when such is thrown", done => {
            sinon.stub(User, "findOne", (query, cb) => {
                cb({ err: 'User not found' }, null);
            });

            data.getUserByUsername()
                .catch(err => {
                    expect(err.err).to.equal('User not found');
                    done();
                });
        });
    });

    describe('createUser(user)', () => {
        const user = {
            username: 'testUsername',
            firstName: 'Testfirstname',
            lastName: 'Testlastname',
            passHash: 'testPassHash',
            email: 'test@email.com'
        };

        beforeEach(() => {
            sinon.stub(User.prototype, 'save', cb => {
                cb(null);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect validator to be called with correct user', done => {
            let calledUser;

            sinon.stub(Validator, 'isValidUser', user => {
                calledUser = user;
                return true;
            });

            data.createUser(user)
                .then(() => {
                    expect(calledUser).to.eql(user);
                    done();
                })
        });

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

        it('Expect to create new user', done => {
            sinon.stub(Validator, 'isValidUser', () => {
                return true;
            });

            data.createUser(user)
                .then((createdUser) => {
                    expect(createdUser.username).to.equal('testUsername');
                    expect(createdUser.firstName).to.equal('Testfirstname');
                    expect(createdUser.lastName).to.equal('Testlastname');
                    expect(createdUser.email).to.equal('test@email.com');
                }).then(done, done);
        });
    });

    describe('updateUserInformation(username, newInfo)', () => {
        const users = [{ username: 'testusername' }, { username: 'testusername2' }];

        afterEach(() => {
            sinon.restore();
        });


        it('Expect findOneAndUpdate to be provide new username to the user', done => {
            sinon.stub(User, 'findOneAndUpdate', ({ username }, newInfo, cb) => {
                let user = users.find(x => x.username === username);
                user.username = newInfo;
                cb(null, user);
            });

            data.updateUserInformation('testusername', 'newUsername')
                .then(user => {
                    expect(user.username).to.be.equal('newUsername');
                    done();
                })
        });

        it('Expect findOneAndUpdate to provide new email to the user', done => {
            sinon.stub(User, 'findOneAndUpdate', ({ username }, newInfo, cb) => {
                let user = users.find(x => x.username === username);
                user.email = newInfo;
                cb(null, user);
            });

            data.updateUserInformation('testusername2', 'newEmail')
                .then(user => {
                    expect(user.email).to.be.equal('newEmail');
                    done();
                })
        });

        it('Expect findOneAndUpdate to provide new firstname to the user', done => {
            sinon.stub(User, 'findOneAndUpdate', ({ username }, newInfo, cb) => {
                let user = users.find(x => x.username === username);
                user.firstName = newInfo;
                cb(null, user);
            });

            data.updateUserInformation('testusername2', 'newFirstName')
                .then(user => {
                    expect(user.firstName).to.be.equal('newFirstName');
                    done();
                })
        });

        it('Expect findOneAndUpdate to provide new firstname to the user', done => {
            sinon.stub(User, 'findOneAndUpdate', ({ username }, newInfo, cb) => {
                let user = users.find(x => x.username === username);
                user.lastName = newInfo;
                cb(null, user);
            });

            data.updateUserInformation('testusername2', 'newLastName')
                .then(user => {
                    expect(user.lastName).to.be.equal('newLastName');
                    done();
                })
        });
    });
})