var expect = require('chai').expect;
var rangesAfterAddingRange = require('../lib/ranges-after-adding-range');

describe('ranges-after-adding-range', function() {
    var tests = [{
        input: [{
            from: 0,
            to: 1
        }],
        add: {
            from: 2,
            to: 3
        },
        results: [{
            from: 0,
            to: 1
        }, {
            from: 2,
            to: 3
        }]
    }, {
        input: [{
            from: 0,
            to: 1
        }],
        add: {
            from: 0,
            to: 3
        },
        results: [{
            from: 0,
            to: 3
        }]
    }, {
        input: [{
            from: 0,
            to: 1
        }, {
            from: 10,
            to: 100
        }, {
            from: 1000,
            to: 10000
        }],
        add: {
            from: 100,
            to: 600
        },
        results: [{
            from: 0,
            to: 1
        }, {
            from: 10,
            to: 600
        }, {
            from: 1000,
            to: 10000
        }]
    }, {
        input: [{
            from: 0,
            to: 1
        }, {
            from: 10,
            to: 100
        }, {
            from: 1000,
            to: 10000
        }],
        add: {
            from: 99,
            to: 600
        },
        results: [{
            from: 0,
            to: 1
        }, {
            from: 10,
            to: 600
        }, {
            from: 1000,
            to: 10000
        }]
    }];

    for(var i=0; i<tests.length; i++) {
        (function(test) {
            var expectedStringified = JSON.stringify(test.results);
            it('test '+(i+1), function() {
                var result = rangesAfterAddingRange(test.input, test.add);

                expect(JSON.stringify(result)).to.equal(expectedStringified);
                expect(result.length).to.equal(test.results.length);
            });
        })(tests[i]);
    }
});