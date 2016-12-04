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
    })
});