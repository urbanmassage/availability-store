var expect = require('chai').expect;
var earliestInRanges = require('../lib/earliest-in-ranges');

describe('earliest-in-ranges', function() {
    var tests = [{
        ranges: [{
            from: 0,
            to: 0
        }],
        result: 0
    }, {
        ranges: [{
            from: 0,
            to: 1
        }],
        result: 0
    }, {
        ranges: [{
            from: 0,
            to: 1
        }, {
            from: 5,
            to: 6
        }],
        result: 0
    }, {
        ranges: [{
            from: 5,
            to: 6
        }, {
            from: 1,
            to: 10
        }],
        result: 1
    }, {
        ranges: [{
            from: 5,
            to: 10
        }],
        result: 5
    }, {
        ranges: [{
            from: 5,
            to: 10
        }],
        result: 5
    }];

    for(var i=0; i<tests.length; i++) {
        (function(test) {
            var rangesDescParts = [];
            for(var i=0; i<test.ranges.length; i++) {
                rangesDescParts.push(test.ranges[i].from+'-'+test.ranges[i].to);
            }
            it('should return '+test.result+' for ranges=['+rangesDescParts.join('],[')+']', function() {
                var result = earliestInRanges(test.ranges);

                expect(result).to.equal(test.result);
            });
        })(tests[i]);
    }
});