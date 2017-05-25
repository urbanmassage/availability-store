import {expect} from 'chai';
import sortRangesOnStore = require('../lib/sort-ranges');
import {IAvailabilityStore} from '../contracts';

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
    periods: [{
      from: 0,
      to: 1
    }, {
      from: 10,
      to: 12
    }],
    firstAvailable: -1,
    lastAvailable: -1,
  }, {
    periods: [{
      from: 100,
      to: 110
    }, {
      from: 10,
      to: 12
    }],
    firstAvailable: -1,
    lastAvailable: -1,
  }, {
    periods: [{
      from: 50,
      to: 120
    }, {
      from: 1,
      to: 100
    }, {
      from: 1900,
      to: 1220
    }],
    firstAvailable: -1,
    lastAvailable: -1,
  }];

  for (let i = 0; i < tests.length; i++) {
    (function(test) {
      const rangesDescParts = [];
      for (let i = 0; i < test.periods.length; i++) {
        rangesDescParts.push(test.periods[i].from + '-' + test.periods[i].to);
      }
      it('should sort ranges [' + rangesDescParts.join('],[') + ']', function() {
        sortRangesOnStore(test);

        expect(isSortedCorrectly(test.periods)).to.equal(true);

        const processedRangesDescParts = [];
        for (let i = 0; i < test.periods.length; i++) {
          processedRangesDescParts.push(test.periods[i].from + '-' + test.periods[i].to);
        }
      });
    })(tests[i]);
  }
});

describe('latest-in-ranges', function () {
  var tests: any[] = [{
    periods: [{
      from: 0,
      to: 0
    }],
    result: 0
  }, {
    periods: [{
      from: 0,
      to: 1
    }],
    result: 1
  }, {
    periods: [{
      from: 0,
      to: 1
    }, {
        from: 5,
        to: 6
      }],
    result: 6
  }, {
    periods: [{
      from: 5,
      to: 6
    }, {
        from: 1,
        to: 10
      }],
    result: 10
  }, {
    periods: [{
      from: 5,
      to: 10
    }],
    result: 10
  }, {
    periods: [{
      from: 5,
      to: 11
    }],
    result: 11
  }];

  for (let i = 0; i < tests.length; i++) {
    (function (test) {
      const rangesDescParts = [];
      for (let i = 0; i < test.periods.length; i++) {
        rangesDescParts.push(test.periods[i].from + '-' + test.periods[i].to);
      }
      it('should return ' + test.result + ' for ranges=[' + rangesDescParts.join('],[') + ']', function () {
        sortRangesOnStore(test);

        expect(test.lastAvailable).to.equal(test.result);
      });
    })(tests[i]);
  }
});

describe('earliest-in-ranges', function() {
  const tests:any[] = [{
    periods: [{
      from: 0,
      to: 0
    }],
    result: 0
  }, {
    periods: [{
      from: 0,
      to: 1
    }],
    result: 0
  }, {
    periods: [{
      from: 0,
      to: 1
    }, {
        from: 5,
        to: 6
      }],
    result: 0
  }, {
    periods: [{
      from: 5,
      to: 6
    }, {
        from: 1,
        to: 10
      }],
    result: 1
  }, {
    periods: [{
      from: 5,
      to: 10
    }],
    result: 5
  }, {
    periods: [{
      from: 5,
      to: 10
    }],
    result: 5
  }];

  for (var i = 0; i < tests.length; i++) {
    (function(test) {
      var rangesDescParts = [];
      for (var i = 0; i < test.periods.length; i++) {
        rangesDescParts.push(test.periods[i].from + '-' + test.periods[i].to);
      }
      it('should return ' + test.result + ' for ranges=[' + rangesDescParts.join('],[') + ']', function() {
        sortRangesOnStore(test);

        expect(test.firstAvailable).to.equal(test.result);
      });
    })(tests[i]);
  }
});
