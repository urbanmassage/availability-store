var moment = require('moment');
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
                from: cached[i].from,
                to: cached[i].to
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
    var store = this;

    return hasAvailabilityForRange(store.periods, {
        from: from,
        to: to
    });
};

AvailabilityStore.prototype.isAvailableForPeriod = function(from, to) {
    var store = this;

    return isCompletelyAvailableForRange(store.periods, {
        from: from,
        to: to
    });
};

module.exports = AvailabilityStore;