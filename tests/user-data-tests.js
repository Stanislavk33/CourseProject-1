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
        let nonExistingUserId = 999;

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
    });

    describe('getAllUsers()', () => {
        it('Expect to return 3 users', done => {
            let users = ['ElenaZarkova', 'MartinYotov', 'SilviyaBoteva'];
            sinon.stub(User, 'find', cb => {
                cb(null, users);
            });

            data.getAllUsers()
                .then(actualUser => {
                    expect(actualUser).to.equal(users);
                    done();
                });
        });
    });
});