import IPeriod from '../period';

const DEFAULT_LATEST = 0;

/**
 * get the latest point in range
 */
function latestInRanges(ranges: IPeriod[]): number {
  let latest = DEFAULT_LATEST;

  for (let i = 0; i < ranges.length; i++) {
    if (ranges[i].to > latest) {
      latest = ranges[i].to;
    }
  }

  return latest;
};

export = latestInRanges;
