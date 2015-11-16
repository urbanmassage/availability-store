import Pool = require('opool');

// import rangesIntersectInclusive = require('./lib/ranges-intersect-inclusive');
import sortRanges = require('./lib/sort-ranges');
import rangeIsEmpty = require('./lib/range-is-empty');
import hasAvailabilityForRange = require('./lib/has-availability-for-range');
import isCompletelyAvailableForRange = require('./lib/is-completely-available-for-range');
import earliestInRanges = require('./lib/earliest-in-ranges');
import latestInRanges = require('./lib/latest-in-ranges');
import rangesAfterRemovingRange = require('./lib/ranges-after-removing-range');
import rangesAfterAddingRange = require('./lib/ranges-after-adding-range');

interface IPeriod {
  from: number;
  to: number;
}

class AvailabilityStore {
  periods: IPeriod[];
  firstAvailable: number;
  lastAvailable: number;

  constructor() {
    this.reset();
  }

  reset() {
    this.firstAvailable = 0;
    this.lastAvailable = 0;
    this.periods = [];
  }

  setupFromCachedPeriods(cached: IPeriod[]) {
    this.periods = [];
    for (var i = 0; i < cached.length; i++) {
      if (rangeIsEmpty(cached[i]) !== true) {
        // only add period if it's not empty

        this.periods.push({
          from: cached[i].from * 1,
          to: cached[i].to * 1
        });
      }
    }

    sortRanges(this.periods);
    this.firstAvailable = earliestInRanges(this.periods);
    this.lastAvailable = latestInRanges(this.periods);
  }

  serialize() {
    sortRanges(this.periods);

    var newPeriods = [];
    for (var i = 0; i < this.periods.length; i++) {
      if (rangeIsEmpty(this.periods[i]) !== true) {
        // only add period if it's not empty

        newPeriods.push({
          from: this.periods[i].from,
          to: this.periods[i].to
        });
      }
    }

    return newPeriods;
  }

  forceAvailableForPeriod(from: string, to: string);
  forceAvailableForPeriod(from: number, to: number);
  forceAvailableForPeriod(from, to) {
    from = from * 1;
    to = to * 1;

    if (rangeIsEmpty({ from: from, to: to })) {
      // ignore empty ranges
      return false;
    }

    this.periods = rangesAfterAddingRange(this.periods, {
      from: from,
      to: to
    });

    this.firstAvailable = earliestInRanges(this.periods);
    this.lastAvailable = latestInRanges(this.periods);
  }

  markUnavailableForPeriod(from: string, to: string);
  markUnavailableForPeriod(from: number, to: number);
  markUnavailableForPeriod(from, to) {
    from = from * 1;
    to = to * 1;

    if (rangeIsEmpty({ from: from, to: to })) {
      // ignore empty ranges
      return false;
    }

    this.periods = rangesAfterRemovingRange(this.periods, {
      from: from,
      to: to
    });

    this.firstAvailable = earliestInRanges(this.periods);
    this.lastAvailable = latestInRanges(this.periods);
  }

  markUnavailableBeforeTime(time: string);
  markUnavailableBeforeTime(time: number);
  markUnavailableBeforeTime(time) {
    time = time * 1;

    this.firstAvailable = earliestInRanges(this.periods);

    this.periods = rangesAfterRemovingRange(this.periods, {
      from: this.firstAvailable,
      to: time
    });

    this.firstAvailable = earliestInRanges(this.periods);
    this.lastAvailable = latestInRanges(this.periods);
  }

  hasAvailabilityForPeriod(from: string, to: string);
  hasAvailabilityForPeriod(from: number, to: number);
  hasAvailabilityForPeriod(from, to) {
    from = from * 1;
    to = to * 1;

    return hasAvailabilityForRange(this.periods, {
      from: from,
      to: to
    });
  }

  isAvailableForPeriod(from: string, to: string);
  isAvailableForPeriod(from: number, to: number);
  isAvailableForPeriod(from, to) {
    from = from * 1;
    to = to * 1;

    return isCompletelyAvailableForRange(this.periods, {
      from: from,
      to: to
    });
  }

  static pool = new Pool(AvailabilityStore);

  static get() {
    return AvailabilityStore.pool.get();
  }
  release() {
    AvailabilityStore.pool.release(this);
  }
}

export = AvailabilityStore;
