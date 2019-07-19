import { IPeriod } from '../contracts';

function sanitizeRange(range: IPeriod): void {
  if (range.from > range.to) {
    const oldRangeFrom = range.from;
    range.from = range.to;
    range.to = oldRangeFrom;
  }
}

export = sanitizeRange;
