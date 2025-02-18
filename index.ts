import Pool = require('opool');

// import rangesIntersectInclusive = require('./lib/ranges-intersect-inclusive');
import sortRangesOnStore = require('./lib/sort-ranges');
import rangeIsEmpty = require('./lib/range-is-empty');
import hasAvailabilityForRange = require('./lib/has-availability-for-range');
import isCompletelyAvailableForRange = require('./lib/is-completely-available-for-range');
import removeRangeFromStore = require('./lib/remove-range-from-store');
import addRangeToStore = require('./lib/add-range-to-store');
import intersectStores = require('./lib/intersect-stores');

class AvailabilityStore {
  periods: AvailabilityStore.IPeriod[];
  firstAvailable: number;
  lastAvailable: number;
  log: AvailabilityStore.ILogItem[] = [];

  constructor() {
    AvailabilityStore.reset(this);
  }

  static reset(obj: AvailabilityStore) {
    obj.firstAvailable = 0;
    obj.lastAvailable = 0;
    obj.periods = [];
    obj.log = [];
  }

  setupFromCachedPeriods(cached: AvailabilityStore.IPeriod[]) {
    this.periods = [];
    for (var i = 0; i < cached.length; i++) {
      if (rangeIsEmpty(cached[i]) !== true) {
        // only add period if it's not empty

        this.log.push({
          action: 'add',
          from: cached[i].from,
          to: cached[i].to,
          reason: 'restore cache',
        });

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

  forceAvailableForPeriod(from: string, to: string, reason: string);
  forceAvailableForPeriod(from: number, to: number, reason: string);
  forceAvailableForPeriod(from, to, reason: string) {
    from = from * 1;
    to = to * 1;

    addRangeToStore(this, {
      from: from,
      to: to,
    }, reason);
  }

  markUnavailableForPeriod(from: string, to: string, reason: string);
  markUnavailableForPeriod(from: number, to: number, reason: string);
  markUnavailableForPeriod(from, to, reason: string) {
    from = from * 1;
    to = to * 1;

    removeRangeFromStore(this, {
      from: from,
      to: to,
    }, reason);
  }

  markUnavailableBeforeTime(time: string, reason: string);
  markUnavailableBeforeTime(time: number, reason: string);
  markUnavailableBeforeTime(time, reason: string) {
    time = time * 1;

    removeRangeFromStore(this, {
      from: this.firstAvailable,
      to: time,
    }, reason);
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
  static intersectStores(
    store1: AvailabilityStore,
    store2: AvailabilityStore,
  ): AvailabilityStore {
    return intersectStores(store1, store2, new AvailabilityStore());
  }

  intersect(store: AvailabilityStore): AvailabilityStore {
    return AvailabilityStore.intersectStores(this, store);
  }
}

module AvailabilityStore {
  export interface IPeriod {
    from: number;
    to: number;
  }
  export interface ILogItem { action: 'add' | 'remove', reason: string, from: number, to: number };
}

export = AvailabilityStore;
