import {expect} from 'chai';
import rangesIntersectInclusive = require('../lib/ranges-intersect-inclusive');

describe('ranges-intersect-inclusive', function() {
  const tests = [{
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
      from: 0,
      to: 1
    },
    input2: {
      from: 1,
      to: 2
    },
    result: false
  }, {
    input1: {
      from: 5,
      to: 6
    },
    input2: {
      from: 4,
      to: 5
    },
    result: false
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

  for (let i = 0; i < tests.length; i++) {
    (function(test) {
      it('should determine intersection=' + test.result + ' for [' + test.input1.from + '-' + test.input1.to + '] and [' + test.input2.from + '-' + test.input2.to + ']', function() {
        const result = rangesIntersectInclusive(test.input1, test.input2);

        expect(result).to.equal(test.result);
      });
    })(tests[i]);
  }
});