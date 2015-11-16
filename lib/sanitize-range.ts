function sanitizeRange(range) {
  if (range.from > range.to) {
    const oldRangeFrom = range.from;
    range.from = range.to;
    range.to = oldRangeFrom;
  }
};

export = sanitizeRange;
