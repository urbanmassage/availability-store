var expect = require('chai').expect;
var rangeCompletelyContainsRange = require('../lib/range-completely-contains-range');

describe('range-completely-contains-range', function() {
    var tests = [{
        input1: {
            from: 0,
            to: 0
        },
        input2: {
            from: 0,
            to: 0
        },
        result: false
    }, {
        input1: {
            from: 0,
            to: 10
        },
        input2: {
            from: 1,
            to: 2
        },
        result: true
    }, {
        input1: {
            from: 0,
            to: 10
        },
        input2: {
            from: 0,
            to: 2
        },
        result: true
    }, {
        input1: {
            from: 0,
            to: 10
        },
        input2: {
            from: 2,
            to: 10
        },
        result: true
    }, {
        input1: {
            from: 5,
            to: 10
        },
        input2: {
            from: 10,
            to: 12
        },
        result: false
    }, {
        input1: {
            from: 10,
            to: 14
        },
        input2: {
            from: 12,
            to: 14
        },
        result: true
    }, {
        input1: {
            from: 5,
            to: 10
        },
        input2: {
            from: 5,
            to: 10
        },
        result: true
    }];

    for(var i=0; i<tests.length; i++) {
        (function(test) {
            it('should return '+test.result+' for ['+test.input1.from+'-'+test.input1.to+'] and ['+test.input2.from+'-'+test.input2.to+']', function() {
                var result = rangeCompletelyContainsRange(test.input1, test.input2);

                expect(result).to.equal(test.result);
            });
        })(tests[i]);
    }
});
