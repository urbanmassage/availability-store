var moment = require('moment');
var Pool = require('opool');
var debug = require('debug')('availability-store');

var rangesIntersectInclusive = require('./lib/ranges-intersect-inclusive');
var sortRanges = require('./lib/sort-ranges');
var rangeIsEmpty = require('./lib/range-is-empty');
var hasAvailabilityForRange = require('./lib/has-availability-for-range');
var isCompletelyAvailableForRange = require('./lib/is-completely-available-for-range');
var earliestInRanges = require('./lib/earliest-in-ranges');
var latestInRanges = require('./lib/latest-in-ranges');
var rangesAfterRemovingRange = require('./lib/ranges-after-removing-range');
var rangesAfterAddingRange = require('./lib/ranges-after-adding-range');

var AvailabilityStore = function AvailabilityStore(logInfo) {
    this.reset();
};

AvailabilityStore.prototype.reset = function reset() {
    this.firstAvailable = 0;
    this.lastAvailable = 0;
    this.periods = [];
};

AvailabilityStore.prototype.setupFromCachedPeriods = function(cached) {
    var store = this;
    store.periods = [];
    for(var i=0; i<cached.length; i++) {
        if(rangeIsEmpty(cached[i]) !== true) {
            // only add period if it's not empty

            store.periods.push({
                from: cached[i].from * 1,
                to: cached[i].to * 1
            });
        }
    }

    sortRanges(store.periods);
    store.firstAvailable = earliestInRanges(store.periods);
    store.lastAvailable = latestInRanges(store.periods);
};

AvailabilityStore.prototype.serialize = function() {
    var store = this;

    sortRanges(store.periods);

    var newPeriods = [];
    for(var i=0; i<store.periods.length; i++) {
        if(rangeIsEmpty(store.periods[i]) !== true) {
            // only add period if it's not empty

            newPeriods.push({
                from: store.periods[i].from,
                to: store.periods[i].to
            });
        }
    }

    return newPeriods;
};

AvailabilityStore.prototype.forceAvailableForPeriod = function(from, to) {
    from = from * 1;
    to = to * 1;

    if(rangeIsEmpty({ from: from, to: to })) {
        // ignore empty ranges
        return false;
    }

    var store = this;
    store.periods = rangesAfterAddingRange(store.periods, {
        from: from,
        to: to
    });

    store.firstAvailable = earliestInRanges(store.periods);
    store.lastAvailable = latestInRanges(store.periods);
};

AvailabilityStore.prototype.markUnavailableForPeriod = function(from, to) {
    from = from * 1;
    to = to * 1;

    if(rangeIsEmpty({ from: from, to: to })) {
        // ignore empty ranges
        return false;
    }

    var store = this;
    store.periods = rangesAfterRemovingRange(store.periods, {
        from: from,
        to: to
    });

    store.firstAvailable = earliestInRanges(store.periods);
    store.lastAvailable = latestInRanges(store.periods);
};

AvailabilityStore.prototype.markUnavailableBeforeTime = function(time) {
    time = time * 1;

    var store = this;

    store.firstAvailable = earliestInRanges(store.periods);

    store.periods = rangesAfterRemovingRange(store.periods, {
        from: store.firstAvailable,
        to: time
    });

    store.firstAvailable = earliestInRanges(store.periods);
    store.lastAvailable = latestInRanges(store.periods);
};

AvailabilityStore.prototype.hasAvailabilityForPeriod = function(from, to) {
    from = from * 1;
    to = to * 1;

    var store = this;

    return hasAvailabilityForRange(store.periods, {
        from: from,
        to: to
    });
};

AvailabilityStore.prototype.isAvailableForPeriod = function(from, to) {
    from = from * 1;
    to = to * 1;

    var store = this;

    return isCompletelyAvailableForRange(store.periods, {
        from: from,
        to: to
    });
};

var pool = new Pool(AvailabilityStore);

AvailabilityStore.get = function get() {
  return pool.get();
};

AvailabilityStore.prototype.release = function release() {
  pool.release(this);
};

module.exports = AvailabilityStore;
