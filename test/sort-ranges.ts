import {expect} from 'chai';
import sortRanges = require('../lib/sort-ranges');

function isSortedCorrectly(ranges) {
  var last = null;
  for (var i = 0; i < ranges.length; i++) {
    var current = ranges[i];
    if (last !== null && current.from < last.from) return false;
    last = current;
  }
  return true;
};

describe('sort-ranges', function() {
  var tests = [{
    ranges: [{
      from: 0,
      to: 1
    }, {
      from: 10,
      to: 12
    }]
  }, {
    ranges: [{
      from: 100,
      to: 110
    }, {
      from: 10,
      to: 12
    }]
  }, {
    ranges: [{
      from: 50,
      to: 120
    }, {
      from: 1,
      to: 100
    }, {
      from: 1900,
      to: 1220
    }]
  }];

  for (let i = 0; i < tests.length; i++) {
    (function(test) {
      const rangesDescParts = [];
      for (let i = 0; i < test.ranges.length; i++) {
        rangesDescParts.push(test.ranges[i].from + '-' + test.ranges[i].to);
      }
      it('should sort ranges [' + rangesDescParts.join('],[') + ']', function() {
        sortRanges(test.ranges);

        expect(isSortedCorrectly(test.ranges)).to.equal(true);

        const processedRangesDescParts = [];
        for (let i = 0; i < test.ranges.length; i++) {
          processedRangesDescParts.push(test.ranges[i].from + '-' + test.ranges[i].to);
        }
        console.log('input=[' + rangesDescParts.join('],[') + '] result=[' + processedRangesDescParts.join('],[') + ']');
      });
    })(tests[i]);
  }
});