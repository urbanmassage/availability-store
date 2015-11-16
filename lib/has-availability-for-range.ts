import sanitizeRange = require('./sanitize-range');
import rangesIntersectInclusive = require('./ranges-intersect-inclusive');

// this method checks if the searchRange overlaps any of the specified ranges
function hasAvailabilityForRange(ranges, searchRange) {
  // if ranges is empty, it cannot contain the searchRange
  if (ranges.length === 0) {
    return false;
  }

  // flip the range if necessary
  sanitizeRange(searchRange);

  for (let i = 0; i < ranges.length; i++) {
    if (rangesIntersectInclusive(ranges[i], searchRange) === true) {
      return true;
    }
  }

  return false;
};

export = hasAvailabilityForRange;
