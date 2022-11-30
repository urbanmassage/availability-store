import { IAvailabilityStore, IPeriod } from '../contracts';
import sanitizeRange = require('./sanitize-range');
import rangeIsEmpty = require('./range-is-empty');
import rangesIntersectInclusive = require('./ranges-intersect-inclusive');
import sortRangesOnStore = require('./sort-ranges');

const debug = require('debug')('availability-store:remove-range-from-store');

// this method removes a range from a set of ranges
function removeRangeFromStore(
  availabilityStore: IAvailabilityStore,
  rangeToRemove: IPeriod,
  reason: string,
): void {
  availabilityStore.log.push({
    action: 'remove',
    from: rangeToRemove.from,
    to: rangeToRemove.to,
    reason,
  });
  
  // if ranges is empty, it cannot contain the rangeToRemove
  if (availabilityStore.periods.length === 0) {
    return;
  }

  // if rangeToRemove is empty, no need to process ranges
  if (rangeIsEmpty(rangeToRemove)) {
    debug('rangeIsEmpty(rangeToRemove)', rangeToRemove);

    return;
  }

  sanitizeRange(rangeToRemove);

  if (rangeToRemove.to < availabilityStore.firstAvailable) {
    // rangeToRemove is before all ranges passed in
    // do nothing!

    debug(
      'rangeToRemove.to < earliest',
      availabilityStore.periods,
      rangeToRemove,
    );

    return;
  }

  if (rangeToRemove.from > availabilityStore.lastAvailable) {
    // rangeToRemove is after all ranges passed in
    // do nothing!

    debug(
      'rangeToRemove.from > latest',
      availabilityStore.periods,
      rangeToRemove,
    );

    return;
  }

  // if we hit here then rangeToRemove must overlap the passed ranges in some way
  const output: IPeriod[] = [];

  availabilityStore.periods.forEach(range => {
    if (!rangesIntersectInclusive(range, rangeToRemove)) {
      // rangeToRemove isn't within this range, skip
      output.push(range);
    } else {
      // if we hit here, ranges[i] must intersect rangeToRemove

      if (rangeToRemove.from <= range.from && rangeToRemove.to >= range.to) {
        // +   --------
        // -  ----------
        // =
        // covers more than period, drop period
        // +   --------
        // -   --------
        // =
        // exactly covers period, drop period
      } else if (
        rangeToRemove.from > range.from &&
        rangeToRemove.from < range.to &&
        rangeToRemove.to > range.to
      ) {
        // +  -----
        // -     -----
        // =  ---

        range.to = rangeToRemove.from;
        output.push(range);
      } else if (
        rangeToRemove.from < range.from &&
        rangeToRemove.to > range.from &&
        rangeToRemove.to < range.to
      ) {
        // +     -----
        // -  -----
        // =       ---

        range.from = rangeToRemove.to;
        output.push(range);
      } else {
        // rangeToRemove is completely within ranges[i]
        // +   -----------------
        // -     ----
        // =   --
        // =         -----------

        const firstPartOfSplit = {
          from: range.from,
          to: rangeToRemove.from,
        };
        const secondPartOfSplit = {
          from: rangeToRemove.to,
          to: range.to,
        };

        if (!rangeIsEmpty(firstPartOfSplit)) {
          output.push(firstPartOfSplit);
        }
        if (!rangeIsEmpty(secondPartOfSplit)) {
          output.push(secondPartOfSplit);
        }
      }
    }
  });
  availabilityStore.periods = output;

  return sortRangesOnStore(availabilityStore);
}

export = removeRangeFromStore;
