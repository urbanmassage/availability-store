import sanitizeRange = require('./sanitize-range');
import rangeIsEmpty = require('./range-is-empty');
import sortRanges = require('./sort-ranges');
import rangesIntersectInclusive = require('./ranges-intersect-inclusive');
import calculateRangeUnion = require('./range-union');
import earliestInRanges = require('./earliest-in-ranges');
import latestInRanges = require('./latest-in-ranges');
import rangesAdjoin = require('./ranges-adjoin');

const debug = require('debug')('availability-store:ranges-after-adding-range');

// this method removes a range from a set of ranges
function rangesAfterAddingRange(ranges, rangeToAdd) {
  sanitizeRange(rangeToAdd);

  // if rangeToAdd is empty, no need to process ranges
  if (rangeIsEmpty(rangeToAdd)) {
    return ranges;
  }

  // if ranges is empty, simply return the new range
  if (ranges.length === 0) {
    return [rangeToAdd];
  }

  var earliest = earliestInRanges(ranges);
  if (rangeToAdd.to < earliest) {
    // rangeToRemove is before all ranges passed in
    // just pop the range in and re sort

    debug('rangeToAdd.to < earliest', ranges, rangeToAdd);

    ranges.push(rangeToAdd);
    sortRanges(ranges);
    return ranges;
  }

  var latest = latestInRanges(ranges);
  if (rangeToAdd.from > latest) {
    // rangeToAdd is after all ranges passed in
    // just pop the range in and re sort

    debug('rangeToAdd.from > latest', ranges, rangeToAdd);

    ranges.push(rangeToAdd);
    sortRanges(ranges);
    return ranges;
  }

  // it looks like we need to process the ranges if we hit here
  var output = [],
    added = false;

  for (var i = 0; i < ranges.length; i++) {
    if (!rangesIntersectInclusive(ranges[i], rangeToAdd) && !rangesAdjoin(ranges[i], rangeToAdd)) {
      if (!added && rangeToAdd.to < ranges[i].from) {
        // should be exactly before this one.
        output.push(rangeToAdd);
        added = true;
      }

      // ranges[i] doesn't overlap rangeToAdd, just pop it back in output
      output.push(ranges[i]);
    } else {
      // merge multiple ranges...
      if (added) {
        rangeToAdd = output.pop();
      }

      // the ranges overlap, calculate the range union
      var union = calculateRangeUnion(ranges[i], rangeToAdd);

      output.push(union);
      added = true;
    }
  }

  if (!added) {
    // We should never reach this point.
    throw Error('Unexpected error in AvailabilityStore#rangesAfterAddingRange.');
  }

  return output;
}

export = rangesAfterAddingRange;
