import {expect} from 'chai';
import calculateRangeUnion = require('../lib/range-union');

describe('range-union', function() {
  var tests = [{
    input1: {
      from: 0,
      to: 0
    },
    input2: {
      from: 0,
      to: 0
    },
    result: {
      from: 0,
      to: 0
    }
  }, {
    input1: {
      from: 0,
      to: 5
    },
    input2: {
      from: 5,
      to: 0
    },
    result: {
      from: 0,
      to: 5
    }
  }, {
    input1: {
      from: 2,
      to: 5
    },
    input2: {
      from: 5,
      to: 0
    },
    result: {
      from: 0,
      to: 5
    }
  }, {
    input1: {
      from: 50,
      to: 40
    },
    input2: {
      from: 5,
      to: 0
    },
    result: {
      from: 0,
      to: 50
    }
  }];

  for (let i = 0; i < tests.length; i++) {
    (function(test) {
      it('should calculate the union of [' + test.input1.from + '-' + test.input1.to + '] and [' + test.input2.from + '-' + test.input2.to + '] as [' + test.result.from + '-' + test.result.to + ']', function() {
        const result = calculateRangeUnion(test.input1, test.input2);

        expect(result.from).to.equal(test.result.from);
        expect(result.to).to.equal(test.result.to);
      });
    })(tests[i]);
  }
});