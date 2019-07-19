import { IPeriod, IAvailabilityStore } from '../contracts';
import sanitizeRange = require('./sanitize-range');
import rangeIsEmpty = require('./range-is-empty');
import sortRangesOnStore = require('./sort-ranges');
import rangesIntersectInclusive = require('./ranges-intersect-inclusive');
import calculateRangeUnion = require('./range-union');
import rangesAdjoin = require('./ranges-adjoin');

const debug = require('debug')('availability-store:add-range-to-store');

// this method removes a range from a set of ranges
function addRangeToStore(
  availabilityStore: IAvailabilityStore,
  rangeToAdd: IPeriod,
): void {
  sanitizeRange(rangeToAdd);

  // if rangeToAdd is empty, no need to process ranges
  if (rangeIsEmpty(rangeToAdd)) {
    return;
  }

  // if ranges is empty, simply return the new range
  if (availabilityStore.periods.length === 0) {
    availabilityStore.periods = [rangeToAdd];
    return sortRangesOnStore(availabilityStore);
  }

  if (rangeToAdd.to < availabilityStore.firstAvailable) {
    // rangeToRemove is before all ranges passed in
    // just unshift the range in and re sort

    debug('rangeToAdd.to < earliest', availabilityStore.periods, rangeToAdd);

    availabilityStore.periods.unshift(rangeToAdd);
    return sortRangesOnStore(availabilityStore);
  }

  if (rangeToAdd.from > availabilityStore.lastAvailable) {
    // rangeToAdd is after all ranges passed in
    // just push the range in and re sort

    debug('rangeToAdd.from > latest', availabilityStore.periods, rangeToAdd);

    availabilityStore.periods.push(rangeToAdd);
    return sortRangesOnStore(availabilityStore);
  }

  // it looks like we need to process the ranges if we hit here
  const output: IPeriod[] = [];
  let added: boolean = false;

  availabilityStore.periods.forEach(range => {
    if (
      !rangesIntersectInclusive(range, rangeToAdd) &&
      !rangesAdjoin(range, rangeToAdd)
    ) {
      if (!added && rangeToAdd.to < range.from) {
        // should be exactly before this one.
        output.push(rangeToAdd);
        added = true;
      }

      // ranges[i] doesn't overlap rangeToAdd, just pop it back in output
      output.push(range);
    } else {
      // merge multiple ranges...
      if (added) {
        rangeToAdd = output.pop();
      }

      // the ranges overlap, calculate the range union
      var union = calculateRangeUnion(range, rangeToAdd);

      output.push(union);
      added = true;
    }
  });
  availabilityStore.periods = output;

  if (!added) {
    // We should never reach this point.
    throw Error('Unexpected error in AvailabilityStore#addRangeToStore.');
  }

  return sortRangesOnStore(availabilityStore);
}

export = addRangeToStore;
