/* globals require describe it beforeEach afterEach*/

const expect = require("chai").expect;
const sinonModule = require("sinon");

describe("Forum data tests", () => {
    let sinon;
    let ForumPost = require('./mocks/forum-data-mock');
    let Validator = require('./mocks/validator-mock');
    let data = require('../server/data/forum-data')({ ForumPost }, Validator);

    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    describe('getForumPosts({page, pageSize})', () => {
        
        let forumPosts = ['Post1', 'Post2', 'Post3'];

        beforeEach(() => {
            sinon.stub(ForumPost, 'find', ({}, {}, { sort, skip, limit }, cb) => {
                const foundPosts = forumPosts.slice(skip, skip + limit)

                cb(null, foundPosts);
            });
        });

        afterEach(() => {
            sinon.restore()
        });

        it('Expect to return the first 2 posts', done => {

            let expectedPosts = ['Post1', 'Post2'];

            data.getForumPosts({page: 1, pageSize: 2})
                .then(actualPosts=> {
                    expect(actualPosts).to.eql(expectedPosts);
                    done();
                });
        });

        it('Expect to return last post', done => {

            let expectedPost = ['Post3'];
            data.getForumPosts({page: 2, pageSize: 2})
                .then(actualPosts=> {
                    expect(actualPosts).to.eql(expectedPost);
                    done();
                });
        });
    });

    describe('getForumPostById(_id)', () => {

        let existingForumPostId = 1;
        let nonExistingForumPostId = 999;

        let forumPost = {
            _id: existingForumPostId,
            title: 'TestForumPost'
        };

        let forumPosts = [forumPost];

        beforeEach(() => {
            sinon.stub(ForumPost, "findOne", (query, cb) => {
                let id = query._id;
                let foundForumPosts= forumPosts.find(post => post._id === id);
                cb(null, foundForumPosts);
            });
        });

        afterEach(() => {
            sinon.restore()
        });

        it('Expect to return forum post by given id', done => {
            
            data.getForumPostById(existingForumPostId)
                .then((actualPost) => {
                    expect(actualPost).to.equal(forumPost);
                })
                .then(done, done);
        });

        it('Expect to return null when post with the given id does not exist', (done) => {
            data.getForumPostById(nonExistingForumPostId)
                .then((actualPost) => {
                    expect(actualPost).to.be.null;
                })
                .then(done, done);
        });
    });

    describe('createForumPost(forumPost)', () => {
        const forumPost = {
            title: 'Title',
            description: 'Description',
            user: 'User'
        }

        beforeEach(() => {
            sinon.stub(ForumPost.prototype, "save", cb => {
                cb(null);
            });
        });

        afterEach(() => {
            sinon.restore()
        });

        it('Expect to reject when validation fail', done => {
            sinon.stub(Validator, 'isValidForumPost', () => {
                return false;
            });

            data.createForumPost(forumPost)
                .then(() => {})
                .catch(() => {
                    done();
                });

            sinon.restore();
        });
        it('Expect to create forum post', done => {
            sinon.stub(Validator, 'isValidForumPost', () => {
                return true;
            });

            data.createForumPost(forumPost)
                .then(createdForumPost => {
                    expect(createdForumPost.title).to.equal(forumPost.title);
                    expect(createdForumPost.description).to.equal(forumPost.description);
                    expect(createdForumPost.user).to.equal(forumPost.user);
                    expect(createdForumPost.likes).to.equal(0);
                    expect(createdForumPost.usersLiked).to.eql([]);
                    expect(createdForumPost.answers).to.eql([]);
                }).then(done, done);

            sinon.restore();    
        });
    });

    describe('getForumPostCount()', () => {
        let forumPosts = [
            {_id: 'testId1', title: 'testPost1'},
            {_id: 'testId2', title: 'testPost2'},
            {_id: 'testId3', title: 'testPost3'},
        ];

        beforeEach(() => {
            sinon.stub(ForumPost, "count", (query, cb) => {
                cb(null, forumPosts.length);
            });
        });

        afterEach(() => {
            sinon.restore()
        });

        it('Expect to return 3', (done) => {
            data.getForumPostCount()
                .then((count) => {
                    expect(count).to.equal(3);
                })
                .then(done, done);
        });
    });

    describe('addAnswerToForumPost(forumPostId, answer)', () => {

        const testId = 1;

        let forumPosts = [
            { _id: 0, answers: [] },
            { _id: 1, answers: [] },
            { _id: 2, answers: [] },
        ]

        const answer = {
            content: 'testContent',
            user: 'TestUser'
        }

        afterEach(() => {
            sinon.restore();
        });

        it('Expect findByIdAndUpdate to be called with correct filter', done => {
            let calledFilter;
            sinon.stub(ForumPost, 'findByIdAndUpdate', (filter, update, cb) => {
                calledFilter = filter;
                cb(null, null);
            });

            data.addAnswerToForumPost(testId, answer)
                .then(() => {
                    expect(calledFilter).to.eql({ '_id': testId });
                }).then(done, done);
        });

        it('Expect findByIdAndUpdate to be called with correct update', done => {
            let calledUpdate;
            sinon.stub(ForumPost, 'findByIdAndUpdate', (filter, update, cb) => {
                calledUpdate = update;
                cb(null, null);
            });

            data.addAnswerToForumPost(testId, answer)
                .then(() => {
                    expect(calledUpdate).to.eql({ $push: { 'answers': answer } });
                }).then(done, done);
        });

        it('Expect to reject if error', done => {
            sinon.stub(ForumPost, 'findByIdAndUpdate', (filter, update, cb) => {
                cb({ err: 'Answer not added' });
            });

            data.addAnswerToForumPost(testId, answer)
                .catch(err => {
                    expect(err.err).to.equal('Answer not added');
                }).then(done, done);
        });

        it('Expect to add one answer', done => {
            sinon.stub(ForumPost, 'findByIdAndUpdate', (filter, update, cb) => {
                const id = filter._id;
                const answer = update.$push.answers;
                forumPosts.forEach(forumPost => {
                    if (forumPost._id === id) {
                        forumPost.answers.push(answer);
                    }
                });

                cb(null);
            });

            data.addAnswerToForumPost(testId, answer)
                .then(() => {
                    expect(forumPosts[1].answers.length).to.equal(1);
                }).then(done, done);
        });

        it('Expect to add answer correctly', done => {
            sinon.stub(ForumPost, 'findByIdAndUpdate', (filter, update, cb) => {
                const id = filter._id;
                const answer = update.$push.answers;
                forumPosts.forEach(forumPost => {
                    if (forumPost._id === id) {
                        forumPost.answers.push(answer);
                    }
                });

                cb(null);
            });

            data.addAnswerToForumPost(testId, answer)
                .then(() => {
                    expect(forumPosts[1].answers[0]).to.equal(answer);
                }).then(done, done);
        });
    });
});