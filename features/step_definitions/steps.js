let {PassThrough} = require('stream');
let {streamToStringRx} = require('rxjs-stream');
let chai = require('chai');
let Rx = require('rxjs');

let REPL = require('../../src/main/nodejs/REPL');

let {defineSupportCode} = require('cucumber');

let expect = chai.expect;

defineSupportCode(function({Given, When, Then}) {
    Given(/^a REPL$/, function () {
        this.repl = new REPL();
    });

    When(/^I input ((?:.|\n)+)$/, function (input, done) {
        this.repl.eval(input, null, null, (throws, returns) => {
            this.throws = throws;
            this.returns = returns;
            done()
        });
    });

    Then(/^I get (.+)$/, function (input) {
        expect(this.throws).to.eql(null);
        expect(this.returns).to.eql(input)
    });
});

