var expect = require('chai').expect;
var rangesAfterRemovingRange = require('../lib/ranges-after-removing-range');

describe('ranges-after-removing-range', function() {
    var tests = [{
        input: [{
            from: 0,
            to: 1
        }],
        remove: {
            from: 2,
            to: 3
        },
        results: [{
            from: 0,
            to: 1
        }]
    }, {
        input: [{
            from: 0,
            to: 1
        }, {
            from: 10,
            to: 100
        }],
        remove: {
            from: 20,
            to: 30
        },
        results: [{
            from: 0,
            to: 1
        }, {
            from: 10,
            to: 20
        }, {
            from: 30,
            to: 100
        }]
    }, {
        input: [{
            from: 10,
            to: 20
        }, {
            from: 21,
            to: 30
        }, {
            from: 35,
            to: 50
        }],
        remove: {
            from: 15,
            to: 30
        },
        results: [{
            from: 10,
            to: 15
        }, {
            from: 35,
            to: 50
        }]
    }, {
        input: [{
            from: 10,
            to: 20
        }, {
            from: 21,
            to: 30
        }, {
            from: 35,
            to: 50
        }],
        remove: {
            from: 20,
            to: 60
        },
        results: [{
            from: 10,
            to: 20
        }]
    }];

    for(var i=0; i<tests.length; i++) {
        (function(test) {
            var expectedStringified = JSON.stringify(test.results);
            it('test '+(i+1), function() {
                var result = rangesAfterRemovingRange(test.input, test.remove);

                expect(JSON.stringify(result)).to.equal(expectedStringified);
                expect(result.length).to.equal(test.results.length);
            });
        })(tests[i]);
    }
});