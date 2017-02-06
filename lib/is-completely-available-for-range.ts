import {IPeriod} from '../contracts';
import sanitizeRange = require('./sanitize-range');
import rangeCompletelyContainsRange = require('./range-completely-contains-range');
import rangeIsEmpty = require('./range-is-empty');

const debug = require('debug')('availability-store:is-completely-available-for-range');

/**
 * check if the searchRange is completely contained within any of the ranges
 */
function isCompletelyAvailableForRange(ranges: IPeriod[], searchRange: IPeriod): boolean {
  // if ranges is empty, it cannot contain the searchRange
  if (ranges.length === 0) {
    return false;
  }

  // flip the range if necessary
  sanitizeRange(searchRange);

  if (rangeIsEmpty(searchRange)) {
    debug('rangeIsEmpty(searchRange)', searchRange);
    return false;
  }

  for (let i = 0; i < ranges.length; i++) {
    if (rangeCompletelyContainsRange(ranges[i], searchRange) === true) {
      debug('rangeCompletelyContainsRange', ranges[i], searchRange);
      return true;
    }
  }

  return false;
};

export = isCompletelyAvailableForRange;
