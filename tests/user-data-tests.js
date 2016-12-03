/* globals require describe it beforeEach afterEach*/

const expect = require("chai").expect;
const sinonModule = require("sinon");

describe("User data tests", () => {
    let sinon;
    let User = require('./mocks/user-data-mock');
    let data = require('../server/data/user-data')({ User });

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

        it('Expect to return undefined when the user is not found', (done) => {
            data.getUserById(10)
                .then((foundUser) => {
                    expect(foundUser).to.be.undefined;
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

    describe('getTopUsers()', () => {
        it('Expect to return top 2 users', done => {
            //Arrange
            let users = ['Silviya', 'Elenaa'];
            sinon.stub(User, 'find', cb => {
                cb(null, users);
            });

            //Act
            data.getTopUsers()
                .then(actualUsers => {
                    //Assert
                    expect(actualUsers).to.equal(users);
                })
                .then(done, done);
        });
    });

    describe('getUserByUsername(username, asPersonalPage)', () => {
        let existingUsername = 'Silviya';

        let user = {
            username: existingUsername,
        };

        let users = [user];

        beforeEach(() => {
            sinon.stub(User, 'findOne', (query, cb) => {
                let username = query.username;
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
        beforeEach(() => {
            sinon.stub(User.prototype, 'save', cb => {
                cb(null);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to save the user with correct data', (done) => {
            let username = 'someuser';
            let firstname = 'Silviya';
            let lastname = 'Boteva';
            let passHash = 'somepasshash';
            let email = 'silviya@gmail.com';
            let salt = 'somesalt';

            data.createUser({ username, firstname, lastname, passHash, email, salt })
                .then((actualUser) => {
                    expect(actualUser.username).to.equal(username);
                    expect(actualUser.firstname).to.equal(firstname);
                    expect(actualUser.lastname).to.equal(lastname);
                    expect(actualUser.passHash).to.equal(passHash);
                    expect(actualUser.email).to.equal(email);
                    expect(actualUser.salt).to.equal(salt);
                }).then(done, done);
        });


    });
});