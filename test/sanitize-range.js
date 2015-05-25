var expect = require('chai').expect;
var sanitizeRange = require('../lib/sanitize-range');

describe('sanitize-range', function() {
	var tests = [{
		input: {
			from: 0,
			to: 0
		},
		result: {
			from: 0,
			to: 0
		}
	}, {
		input: {
			from: 5,
			to: 0
		},
		result: {
			from: 0,
			to: 5
		}
	}, {
		input: {
			from: 2,
			to: 5
		},
		result: {
			from: 2,
			to: 5
		}
	}];

	for(var i=0; i<tests.length; i++) {
		(function(test) {
			var range = {
				from: test.input.from,
				to: test.input.to
			};

			it('should sanitize range ['+test.input.from+'-'+test.input.to+'] to ['+test.result.from+'-'+test.result.to+']', function() {
				sanitizeRange(range);

				expect(range.from).to.equal(test.result.from);
				expect(range.to).to.equal(test.result.to);
			});
		})(tests[i]);
	}
});