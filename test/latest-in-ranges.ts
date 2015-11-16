import {expect} from 'chai';
import latestInRanges = require('../lib/latest-in-ranges');

describe('latest-in-ranges', function () {
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
    result: 1
  }, {
    ranges: [{
      from: 0,
      to: 1
    }, {
        from: 5,
        to: 6
      }],
    result: 6
  }, {
    ranges: [{
      from: 5,
      to: 6
    }, {
        from: 1,
        to: 10
      }],
    result: 10
  }, {
    ranges: [{
      from: 5,
      to: 10
    }],
    result: 10
  }, {
    ranges: [{
      from: 5,
      to: 11
    }],
    result: 11
  }];

  for (let i = 0; i < tests.length; i++) {
    (function (test) {
      const rangesDescParts = [];
      for (let i = 0; i < test.ranges.length; i++) {
        rangesDescParts.push(test.ranges[i].from + '-' + test.ranges[i].to);
      }
      it('should return ' + test.result + ' for ranges=[' + rangesDescParts.join('],[') + ']', function () {
        const result = latestInRanges(test.ranges);

        expect(result).to.equal(test.result);
      });
    })(tests[i]);
  }
});