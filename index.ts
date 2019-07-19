import Pool = require('opool');

// import rangesIntersectInclusive = require('./lib/ranges-intersect-inclusive');
import sortRangesOnStore = require('./lib/sort-ranges');
import rangeIsEmpty = require('./lib/range-is-empty');
import hasAvailabilityForRange = require('./lib/has-availability-for-range');
import isCompletelyAvailableForRange = require('./lib/is-completely-available-for-range');
import removeRangeFromStore = require('./lib/remove-range-from-store');
import addRangeToStore = require('./lib/add-range-to-store');

class AvailabilityStore {
  periods: AvailabilityStore.IPeriod[];
  firstAvailable: number;
  lastAvailable: number;

  constructor() {
    AvailabilityStore.reset(this);
  }

  static reset(obj: AvailabilityStore) {
    obj.firstAvailable = 0;
    obj.lastAvailable = 0;
    obj.periods = [];
  }

  setupFromCachedPeriods(cached: AvailabilityStore.IPeriod[]) {
    this.periods = [];
    for (var i = 0; i < cached.length; i++) {
      if (rangeIsEmpty(cached[i]) !== true) {
        // only add period if it's not empty

        this.periods.push({
          from: cached[i].from * 1,
          to: cached[i].to * 1,
        });
      }
    }
    sortRangesOnStore(this);
  }

  serialize() {
    sortRangesOnStore(this);
    var newPeriods = [];
    for (var i = 0; i < this.periods.length; i++) {
      if (rangeIsEmpty(this.periods[i]) !== true) {
        // only add period if it's not empty

        newPeriods.push({
          from: this.periods[i].from,
          to: this.periods[i].to,
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

    addRangeToStore(this, {
      from: from,
      to: to,
    });
  }

  markUnavailableForPeriod(from: string, to: string);
  markUnavailableForPeriod(from: number, to: number);
  markUnavailableForPeriod(from, to) {
    from = from * 1;
    to = to * 1;

    removeRangeFromStore(this, {
      from: from,
      to: to,
    });
  }

  markUnavailableBeforeTime(time: string);
  markUnavailableBeforeTime(time: number);
  markUnavailableBeforeTime(time) {
    time = time * 1;

    removeRangeFromStore(this, {
      from: this.firstAvailable,
      to: time,
    });
  }

  hasAvailabilityForPeriod(from: string, to: string);
  hasAvailabilityForPeriod(from: number, to: number);
  hasAvailabilityForPeriod(from, to) {
    from = from * 1;
    to = to * 1;

    return hasAvailabilityForRange(this.periods, {
      from: from,
      to: to,
    });
  }

  isAvailableForPeriod(from: string, to: string);
  isAvailableForPeriod(from: number, to: number);
  isAvailableForPeriod(from, to) {
    from = from * 1;
    to = to * 1;

    return isCompletelyAvailableForRange(this.periods, {
      from: from,
      to: to,
    });
  }

  static pool = new Pool(AvailabilityStore);

  static get() {
    return AvailabilityStore.pool.get();
  }
  static release(obj: AvailabilityStore) {
    AvailabilityStore.pool.release(obj);
  }

  release() {
    AvailabilityStore.release(this);
  }
}

module AvailabilityStore {
  export interface IPeriod {
    from: number;
    to: number;
  }
}

export = AvailabilityStore;
