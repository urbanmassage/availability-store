var expect = require('chai').expect;
var isCompletelyAvailableForRange = require('../lib/is-completely-available-for-range');

describe('is-completely-available-for-range', function() {
    var tests = [{
        ranges: [{
            from: 0,
            to: 0
        }],
        search: {
            from: 0,
            to: 0
        },
        result: false
    }, {
        ranges: [{
            from: 0,
            to: 1
        }],
        search: {
            from: 0,
            to: 0
        },
        result: false
    }, {
        ranges: [{
            from: 0,
            to: 1
        }, {
            from: 5,
            to: 6
        }],
        search: {
            from: 1,
            to: 2
        },
        result: false
    }, {
        ranges: [{
            from: 0,
            to: 10
        }, {
            from: 5,
            to: 6
        }],
        search: {
            from: 10,
            to: 11
        },
        result: false
    }, {
        ranges: [{
            from: 0,
            to: 10
        }],
        search: {
            from: 9,
            to: 10
        },
        result: true
    }, {
        ranges: [{
            from: 5,
            to: 10
        }],
        search: {
            from: 6,
            to: 7
        },
        result: true
    }, {
        ranges: [{
            from: 5,
            to: 10
        }],
        search: {
            from: 5,
            to: 6
        },
        result: true
    }];

    for(var i=0; i<tests.length; i++) {
        (function(test) {
            var rangesDescParts = [];
            for(var i=0; i<test.ranges.length; i++) {
                rangesDescParts.push(test.ranges[i].from+'-'+test.ranges[i].to);
            }
            it('should return '+test.result+' for ranges=['+rangesDescParts.join('],[')+'] search=['+test.search.from+'-'+test.search.to+']', function() {
                var result = isCompletelyAvailableForRange(test.ranges, test.search);

                expect(result).to.equal(test.result);
            });
        })(tests[i]);
    }
});