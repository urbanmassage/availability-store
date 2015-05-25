var expect = require('chai').expect;
var rangesIntersect = require('../lib/ranges-intersect');

describe('ranges-intersect', function() {
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
			to: 1
		},
		input2: {
			from: 0,
			to: 1
		},
		result: true
	}, {
		input1: {
			from: 0,
			to: 5
		},
		input2: {
			from: 5,
			to: 0
		},
		result: true
	}, {
		input1: {
			from: 2,
			to: 5
		},
		input2: {
			from: 5,
			to: 0
		},
		result: true
	}, {
		input1: {
			from: 50,
			to: 40
		},
		input2: {
			from: 5,
			to: 0
		},
		result: false
	}];

	for(var i=0; i<tests.length; i++) {
		(function(test) {
			it('should determine intersection='+test.result+' for ['+test.input1.from+'-'+test.input1.to+'] and ['+test.input2.from+'-'+test.input2.to+']', function() {
				var result = rangesIntersect(test.input1, test.input2);

				expect(result.from).to.equal(test.result.from);
				expect(result.to).to.equal(test.result.to);
			});
		})(tests[i]);
	}
});