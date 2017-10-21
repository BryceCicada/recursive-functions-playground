let {PassThrough} = require('stream');
let {streamToStringRx} = require('rxjs-stream');
let chai = require('chai');
let Rx = require('rxjs');

let REPL = require('../../src/main/nodejs/REPL');

let {defineSupportCode} = require('cucumber');

let expect = chai.expect;

defineSupportCode(function({Given, When, Then}) {
    Given(/^a REPL$/, function () {
        this.replInput = new PassThrough();
        let output = new PassThrough();
        this.replOutput = new Rx.ReplaySubject();
        streamToStringRx(output).subscribe(this.replOutput);
        this.repl = new REPL(this.replInput, output);
    });

    When(/^I input (.+)$/, function (input) {
        this.replInput.write(input + '\n');
    });

    Then(/^I get (.+)$/, function (input, done) {
        this.replOutput.first().subscribe(
            x => {
                expect(x).to.eql(input);
                done();
            },
            done,
            done);
    });
});

