/* globals require describe it*/

//describe - (za grupirane na testovete)mqsto s mnojestvo ot testove - ne e zaduljitelno
//it - 

let expect = require('chai').expect;

describe('Test environment', () => {
    it("Expect to pass", () => {
        expect(true).to.be.true;
    });
});