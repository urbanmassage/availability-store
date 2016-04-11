import IPeriod from '../period';
import sanitizeRange = require('./sanitize-range');

function sortRanges(ranges: IPeriod[]): void {
  for (let i = 0; i < ranges.length; i++) {
    sanitizeRange(ranges[i]);
  }

  ranges.sort(function(a, b) {
    if (a.from > b.from) {
      return 1;
    }
    return -1;
  });
};

export = sortRanges;
