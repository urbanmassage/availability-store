var expect = require('chai').expect;
var rangeIsEmpty = require('../lib/range-is-empty');

describe('range-is-empty', function() {
    var tests = [{
        input: {
            from: 0,
            to: 0
        },
        result: true
    }, {
        input: {
            from: 5,
            to: 0
        },
        result: false
    }, {
        input: {
            from: 2,
            to: 5
        },
        result: false
    }];

    for(var i=0; i<tests.length; i++) {
        (function(test) {
            var range = {
                from: test.input.from,
                to: test.input.to
            };

            it('should determine rangeIsEmpty='+test.result+' for ['+test.input.from+'-'+test.input.to+']', function() {
                var result = rangeIsEmpty(test.input);

                expect(result).to.equal(test.result);
            });
        })(tests[i]);
    }
});