import {expect} from 'chai';
import sortRanges = require('../lib/sort-ranges');
import rangesAfterAddingRange = require('../lib/ranges-after-adding-range');

describe('ranges-after-adding-range', function() {
  var tests = [{
    input: [{
      from: 0,
      to: 1
    }],
    add: {
      from: 2,
      to: 3
    },
    results: [{
      from: 0,
      to: 1
    }, {
      from: 2,
      to: 3
    }]
  }, {
    input: [{
      from: 0,
      to: 1
    }],
    add: {
      from: 0,
      to: 3
    },
    results: [{
      from: 0,
      to: 3
    }]
  }, {
    input: [{
      from: 0,
      to: 1
    }, {
      from: 10,
      to: 100
    }, {
      from: 1000,
      to: 10000
    }],
    add: {
      from: 100,
      to: 600
    },
    results: [{
      from: 0,
      to: 1
    }, {
      from: 10,
      to: 600
    }, {
      from: 1000,
      to: 10000
    }]
  }, {
    input: [{
      from: 0,
      to: 1
    }, {
      from: 10,
      to: 100
    }, {
      from: 1000,
      to: 10000
    }],
    add: {
      from: 99,
      to: 600
    },
    results: [{
      from: 0,
      to: 1
    }, {
      from: 10,
      to: 600
    }, {
      from: 1000,
      to: 10000
    }]
  }, {
    input: [{
      from: 0,
      to: 10
    }, {
      from: 20,
      to: 30
    }],
    add: {
      from: 5,
      to: 25
    },
    results: [{
      from: 0,
      to: 30
    }]
  }];

  for (let i = 0; i < tests.length; i++) {
    var test = tests[i];
    var expectedStringified = JSON.stringify(test.results);
    it('test ' + (i + 1), function() {
      const availabilityStore = {
        periods: test.input,
        firstAvailable: -1,
        lastAvailable: -1,
      }
      sortRanges(availabilityStore); // set firstAvailable & lastAvailable
      rangesAfterAddingRange(availabilityStore, test.add);

      expect(availabilityStore.periods.length).to.equal(test.results.length);
      expect(JSON.stringify(availabilityStore.periods)).to.equal(expectedStringified);
    });
  }
});
