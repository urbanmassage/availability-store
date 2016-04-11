import IPeriod from '../period';
import sanitizeRange = require('./sanitize-range');
import rangeIsEmpty = require('./range-is-empty');
import earliestInRanges = require('./earliest-in-ranges');
import latestInRanges = require('./latest-in-ranges');
import rangesIntersectInclusive = require('./ranges-intersect-inclusive');
import sortRanges = require('./sort-ranges');

const debug = require('debug')('availability-store:ranges-after-removing-range');

// this method removes a range from a set of ranges
function rangesAfterRemovingRange(ranges: IPeriod[], rangeToRemove: IPeriod): IPeriod[] {
  // if ranges is empty, it cannot contain the rangeToRemove
  if (ranges.length === 0) {
    return ranges;
  }

  // if rangeToRemove is empty, no need to process ranges
  if (rangeIsEmpty(rangeToRemove)) {
    debug('rangeIsEmpty(rangeToRemove)', rangeToRemove);

    return ranges;
  }

  sanitizeRange(rangeToRemove);

  const earliest = earliestInRanges(ranges);
  if (rangeToRemove.to < earliest) {
    // rangeToRemove is before all ranges passed in
    // do nothing!

    debug('rangeToRemove.to < earliest', ranges, rangeToRemove);

    return ranges;
  }

  const latest = latestInRanges(ranges);
  if (rangeToRemove.from > latest) {
    // rangeToRemove is after all ranges passed in
    // do nothing!

    debug('rangeToRemove.from > latest', ranges, rangeToRemove);

    return ranges;
  }

  // if we hit here then rangeToRemove must overlap the passed ranges in some way
  const output: IPeriod[] = [];

  for (let i = 0; i < ranges.length; i++) {
    if (!rangesIntersectInclusive(ranges[i], rangeToRemove)) {
      // rangeToRemove isn't within this range, skip
      output.push(ranges[i]);
    } else {
      // if we hit here, ranges[i] must intersect rangeToRemove

      if (rangeToRemove.from <= ranges[i].from && rangeToRemove.to >= ranges[i].to) {
        // +   --------
        // -  ----------
        // =
        // covers more than period, drop period

        // +   --------
        // -   --------
        // =
        // exactly covers period, drop period
      } else if (rangeToRemove.from > ranges[i].from && rangeToRemove.from < ranges[i].to && rangeToRemove.to > ranges[i].to) {
        // +  -----
        // -     -----
        // =  ---

        ranges[i].to = rangeToRemove.from;
        output.push(ranges[i]);
      } else if (rangeToRemove.from < ranges[i].from && rangeToRemove.to > ranges[i].from && rangeToRemove.to < ranges[i].to) {
        // +     -----
        // -  -----
        // =       ---

        ranges[i].from = rangeToRemove.to;
        output.push(ranges[i]);
      } else {
        // rangeToRemove is completely within ranges[i]
        // +   -----------------
        // -     ----
        // =   --
        // =         -----------

        const firstPartOfSplit = {
          from: ranges[i].from,
          to: rangeToRemove.from
        };
        const secondPartOfSplit = {
          from: rangeToRemove.to,
          to: ranges[i].to
        };

        if (!rangeIsEmpty(firstPartOfSplit)) {
          output.push(firstPartOfSplit);
        }
        if (!rangeIsEmpty(secondPartOfSplit)) {
          output.push(secondPartOfSplit);
        }
      }
    }
  }

  sortRanges(output);

  return output;
};

export = rangesAfterRemovingRange;
