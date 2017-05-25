import {IPeriod} from '../contracts';
import sanitizeRange = require('./sanitize-range');

function rangeIsEmpty(range: IPeriod): boolean {
  // flip the range if necessary
  sanitizeRange(range);

  if (range.from === range.to) {
    return true;
  }

  return false;
};

export = rangeIsEmpty;
