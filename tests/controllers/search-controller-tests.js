'use strict';

const searchController = require('./../../server/controllers/search-controller');

const sinon = require('sinon'),
    expect = require('chai').expect;

let resMock = {
    render() { }
}

describe('Search Controller Tests', () => {
    describe('Search Competitions Tests', () => {
        let reqMock = {
            user: 'username',
            query: {
                search: 'searchController'
            }
        }
        let competitionsMock = [];

        let dataMock = {
            filterCompetitions(searchName) {
                return new Promise(resolve => resolve(competitionsMock));
            },
            filter() { }
        }

        it('expect data.filterCompetitions(searchName) to be called once', () => {
            let dataSpy = sinon.spy(dataMock, 'filterCompetitions'),
                controller = searchController({ data: dataMock });

            controller.search(reqMock, resMock);
            expect(dataSpy.calledOnce).to.be.true;
            dataSpy.restore;
        });

        it('expect res.render() to be called once', (done) => {
            let resSpy = sinon.spy(resMock, 'render');
            let controller = searchController({ data: dataMock });

            controller.search(reqMock, resMock)
                .then(() => {
                    expect(resSpy.calledOnce).to.be.true;
                    resSpy.restore();
                })
                .then(done, done);
        });

    });
});
