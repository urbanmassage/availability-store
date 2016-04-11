import IPeriod from '../period';
import sortRanges = require('./sort-ranges');

const DEFAULT_EARLIEST: number = 0;

/**
 * Removes a range from a set of ranges
 */
function earliestInRanges(ranges: IPeriod[]): number {
  // if ranges is empty, simply return the new range
  if (ranges.length === 0) {
    return DEFAULT_EARLIEST;
  }

  // make sure the ranges are in order
  sortRanges(ranges);

  // as the ranges are sorted by the 'from' property, we can now safely assume that ranges[0].from is the earliest time
  return ranges[0].from;
}

export = earliestInRanges;
