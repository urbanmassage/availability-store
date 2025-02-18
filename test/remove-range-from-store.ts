import { expect } from 'chai';
import sortRangesOnStore = require('../lib/sort-ranges');
import removeRangeFromStore = require('../lib/remove-range-from-store');

describe('remove-range-from-store', function() {
  var tests = [
    {
      input: [
        {
          from: 0,
          to: 1,
        },
      ],
      remove: {
        from: 2,
        to: 3,
      },
      results: [
        {
          from: 0,
          to: 1,
        },
      ],
    },
    {
      input: [
        {
          from: 0,
          to: 1,
        },
        {
          from: 10,
          to: 100,
        },
      ],
      remove: {
        from: 20,
        to: 30,
      },
      results: [
        {
          from: 0,
          to: 1,
        },
        {
          from: 10,
          to: 20,
        },
        {
          from: 30,
          to: 100,
        },
      ],
    },
    {
      input: [
        {
          from: 10,
          to: 20,
        },
        {
          from: 21,
          to: 30,
        },
        {
          from: 35,
          to: 50,
        },
      ],
      remove: {
        from: 15,
        to: 30,
      },
      results: [
        {
          from: 10,
          to: 15,
        },
        {
          from: 35,
          to: 50,
        },
      ],
    },
    {
      input: [
        {
          from: 10,
          to: 20,
        },
        {
          from: 21,
          to: 30,
        },
        {
          from: 35,
          to: 50,
        },
      ],
      remove: {
        from: 20,
        to: 60,
      },
      results: [
        {
          from: 10,
          to: 20,
        },
      ],
    },
    {
      input: [
        {
          from: 0,
          to: 4,
        },
      ],
      remove: {
        from: 1,
        to: 3,
      },
      results: [
        {
          from: 0,
          to: 1,
        },
        {
          from: 3,
          to: 4,
        },
      ],
    },
    {
      input: [
        {
          from: 1432884600,
          to: 1432890000,
        },
      ],
      remove: {
        from: 1432884600,
        to: 1432890000,
      },
      results: [],
    },
  ];

  for (let i = 0; i < tests.length; i++) {
    var test = tests[i];
    var expectedStringified = JSON.stringify(test.results);
    it('test ' + (i + 1), function() {
      const availabilityStore = {
        periods: test.input,
        firstAvailable: -1,
        lastAvailable: -1,
        log: [],
      };
      sortRangesOnStore(availabilityStore); // set firstAvailable & lastAvailable
      removeRangeFromStore(availabilityStore, test.remove, 'test');

      expect(availabilityStore.periods.length).to.equal(test.results.length);
      expect(JSON.stringify(availabilityStore.periods)).to.equal(
        expectedStringified,
      );
    });
  }
});
