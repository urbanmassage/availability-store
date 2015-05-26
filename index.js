var moment = require('moment');
var debug = require('debug')('availabilityStore');

var rangesIntersect = function(r1, r2) {
    if(!r1 || !r2) {
        // one of the ranges are undefined??
        console.log('availability-store range is undefined', r1, r2);

        return false;
    }

    // check range1 is correct way around
    if(r1.from > r1.to) {
        var r1To = r1.from;
        r1.from = r1.to;
        r1.to = r1To;
    }
    // check range2 is correct way around
    if(r2.from > r2.to) {
        var r2To = r2.from;
        r2.from = r2.to;
        r2.to = r2To;
    }
    
    var e1start = r1.from;
    var e2start = r2.from;
    var e1end = r1.to;
    var e2end = r2.to;

    if(r1.from <= r2.from && r1.to >= r2.to) {
        return true;
    }
    else if(r1.from >= r2.from && r1.to <= r2.to) {
        return true;
    }
    else if(r1.from <= r2.from && r1.to >= r2.from && r1.to <= r2.to) {
        return true;
    }
    else if(r1.from >= r2.from && r1.from <= r2.to && r1.to >= r2.to) {
        return true;
    }
    
    return false;
};

var AvailabilityStore = function AvailabilityStore(logInfo) {
    this.firstAvailable = 0;
    this.lastAvailable = 0;
    this.logInfo = logInfo || '';
    
    var store = this;

    store.periods = [];
    
    var sortPeriods = function() {
        store.periods.sort(function(a, b) {
            if(!a || !b) {
                // one of the ranges are undefined??
                console.log(store.logInfo, 'availability-store sortPeriods range is undefined', a, b);

                return 0;
            }

            // there shouldn't be any overlap of periods at all as we sort that when we add / remove periods
            if(a.from > b.from) {
                return 1;
            }
            else {
                return -1;
            }
        });
    };
    
    this.rangesIntersect = rangesIntersect;
    
    this.setupFromCachedPeriods = function(cached) {
        this.periods = [];
        for(var i=0; i<cached.length; i++) {
            if(cached[i].from !== cached[i].to) {
                // only add period if its start time doesn't equal its end time (i.e. it's at least 1 second long!)

                if(this.firstAvailable > cached[i].from) {
                    this.firstAvailable = cached[i].from;
                }
                if(this.lastAvailable < cached[i].to) {
                    this.lastAvailable = cached[i].to;
                }
            
                this.periods.push({
                    from: cached[i].from,
                    to: cached[i].to
                });
            }
        }
    };

    this.serialize = function() {
        var newPeriods = [];
        for(var i=0; i<store.periods.length; i++) {
            if(!store.periods[i]) {
                console.log(store.logInfo, 'availability-store#serialize period is undefined', store.periods[i]);
                continue;
            }

            if((store.periods[i].from*1) !== (store.periods[i].to*1)) {
                // only add period if its start time doesn't equal its end time (i.e. it's at least 1 second long!)
                
                newPeriods.push({
                    from: store.periods[i].from*1,
                    to: store.periods[i].to*1
                });
            }
        }
        
        return newPeriods;
    };

    this.calculateRangeUnion = function(range1, range2) {
        if(!range1) {
            // one of the ranges are undefined??
            console.log(store.logInfo, 'availability-store#calculateRangeUnion range1 is undefined', range1, range2);

            return range2;
        }
        if(!range2) {
            // one of the ranges are undefined??
            console.log(store.logInfo, 'availability-store#calculateRangeUnion range2 is undefined', range1, range2);

            return range1;
        }

        return {
            from: (range1.from < range2.from ? range1.from : range2.from),
            to: (range1.to > range2.to ? range1.to : range2.to)
        };
    };

    this.forceAvailableForPeriod = function(from, to) {
        if(from === to) {
            // don't add a period of 0 seconds
            return;
        }

        debug('forceAvailableForPeriod', from, to);

        if(from > to) {
            // make sure from is before to
            var oldFrom = from;
            from = to;
            to = oldFrom;
        }
    
        to++; 

        if(store.periods.length === 0) {
            // no periods set yet, set first/lastAvailable to this period and add to array
            
            store.firstAvailable = from;
            store.lastAvailable = to;
            store.periods.push({
                from: from,
                to: to
            });
        }
        else {
            if(from < store.firstAvailable && to < store.firstAvailable) {
                // this period's start+end are before all others in the store so far

                store.firstAvailable = from;
                store.periods.push({
                    from: from,
                    to: to
                });
                
                sortPeriods();
            }
            else if(from > store.lastAvailable && to > store.lastAvailable) {
                // this period's start+end are after all others in the store so far

                store.lastAvailable = to;
                store.periods.push({
                    from: from,
                    to: to
                });
            }
            else {
                // this falls within some of the existing periods....
                
                if(from < store.firstAvailable) {
                    store.firstAvailable = from;
                }
                if(to > store.lastAvailable) {
                    store.lastAvailable = to;
                }
                
                store.periods.push({
                    from: from,
                    to: to
                });
                sortPeriods();
                
                var newPeriods = [];
                var lastPeriod = null;
                var lastPeriodIndex = null;
                for(var i=0; i<store.periods.length; i++) { 
                    if(lastPeriod != null) {
                        if(typeof(store.periods[i]) === 'undefined') {
                            console.log(store.logInfo, 'undefined period about to call rangesIntersect', store.periods, i, from, to);
                        }
                        else {
                            if(rangesIntersect(lastPeriod, store.periods[i])) {
                                // lastPeriod is intersecting current period
                                var newRange = this.calculateRangeUnion({
                                    from: store.periods[i].from,
                                    to: store.periods[i].to
                                }, {
                                    from: lastPeriod.from,
                                    to: lastPeriod.to
                                });

                                var replacementPeriod = {
                                    from: newRange.from,
                                    to: newRange.to
                                };
                                newPeriods[lastPeriodIndex] = replacementPeriod;
                            }
                            else { 
                                // lastPeriod is not intersecting current period
                                lastPeriod = store.periods[i];
                                lastPeriodIndex = i;
                                newPeriods.push(lastPeriod);
                            }
                        }
                    }
                    else {
                        // lastPeriod was null
                        lastPeriod = store.periods[i];
                        lastPeriodIndex = i;
                        newPeriods.push(lastPeriod);
                    }
                }
                
                store.periods = newPeriods;
                sortPeriods();
            }
        }
    };

    this.markUnavailableForPeriod = function(from, to) {
        if(from === to) {
            // don't add a period of 0 seconds
            return;
        }

        var newPeriods = [];
        for(var i=0; i<store.periods.length; i++) {
            if(!store.periods[i]) {
                console.log(store.logInfo, 'availability-store#markUnavailableForPeriod period is undefined', store.periods[i]);
                continue;
            }

            if(store.periods[i].from > to) {
                //console.log('aSmUFP1', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"), moment(from, 'X').format("HH:mm"), moment(to, 'X').format("HH:mm"));
                // +  -----
                // -        ---
                // whole period is after this time
                newPeriods.push(store.periods[i]);
            }
            else if(store.periods[i].to < from) {
                //console.log('aSmUFP2', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"), moment(from, 'X').format("HH:mm"), moment(to, 'X').format("HH:mm"));
                // +      -----
                // -  ---
                // whole period is before this time
                newPeriods.push(store.periods[i]);
            }
            else if(from == store.periods[i].from && to == store.periods[i].to) {
                //console.log('aSmUFP3', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"), moment(from, 'X').format("HH:mm"), moment(to, 'X').format("HH:mm"));
            }
            else if(from <= store.periods[i].from && to >= store.periods[i].to) {  
                //console.log('aSmUFP4', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"), moment(from, 'X').format("HH:mm"), moment(to, 'X').format("HH:mm"));
                // +   --------
                // -  ----------
                // =        
                // covers more than period, drop period
                
                // +   --------
                // -   --------
                // =    
                // exactly covers period, drop period               
            }
            else if(from < store.periods[i].from && to > store.periods[i].from && to <= store.periods[i].from) {
                //console.log('aSmUFP5', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"), moment(from, 'X').format("HH:mm"), moment(to, 'X').format("HH:mm"));
                // +     --------
                // -   ----
                // =       ------
                
                // +     --------
                // -   ----------
                // =             
                store.periods[i].from = from;
                newPeriods.push(store.periods[i]);
            }
            else if(to > store.periods[i].to && from >= store.periods[i].from && from < store.periods[i].to) {
                //console.log('aSmUFP6', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"), moment(from, 'X').format("HH:mm"), moment(to, 'X').format("HH:mm"));
                // +   --------
                // -         ----
                // =   ------
                
                // +   --------
                // -   ----------
                // =         
                store.periods[i].to = from;
                newPeriods.push(store.periods[i]);
                
                //console.log('asm6 new', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"));
            }
            else {
                //console.log('aSmUFP7', moment(store.periods[i].from, 'X').format("HH:mm"), moment(store.periods[i].to, 'X').format("HH:mm"), moment(from, 'X').format("HH:mm"), moment(to, 'X').format("HH:mm"));
                // this unavailable period is completely within the availability period we're looking at
                // +   -----------------
                // -     ----
                // =   --    
                // =         -----------
                
                var oldTo = store.periods[i].to;
                store.periods[i].to = from;
                newPeriods.push(store.periods[i]);
                
                newPeriods.push({
                    from: to,
                    to: oldTo
                });
                
                //store.periods[i].change = true;
                //newPeriods.push(store.periods[i]);
            }
        }
        
        store.periods = newPeriods;
        sortPeriods();
    };

    this.markUnavailableBeforeTime = function(time) {
        //console.log('markUnavailableBeforeTime', time);
        
        // this function should shorten, delete, or split a slot based on the unavailable from/to
        
        if(time < store.firstAvailable) {
            // not available at this time anyway
            return;
        }
        
        var newPeriods = [];
        for(var i=0; i<store.periods.length; i++) {
            if(!store.periods[i]) {
                console.log(store.logInfo, 'availability-store#markUnavailableBeforeTime period is undefined', store.periods[i]);
                continue;
            }

            if(store.periods[i].to > time && store.periods[i].from < time) {
                // part of period is after this time, change start of period
                store.periods[i].from = time;
                newPeriods.push(store.periods[i]);
            }
            else if(store.periods[i].from > time) {
                // whole period is after this time
                newPeriods.push(store.periods[i]);
            }
            else {
                // period is dropped
            }
        }
        
        store.periods = newPeriods;
        sortPeriods();
    };

    this.hasAvailabilityForPeriod = function(from, to) {
        // checks if any of the known periods overlap

        if(from > to) {
            // make sure from is before to
            var oldFrom = from;
            from = to;
            to = oldFrom;
        }

        // check to see if the known periods overlap the search period at all
        for(var i=0; i<store.periods.length; i++) {
            if(!store.periods[i]) {
                console.log(store.logInfo, 'availability-store#hasAvailabilityForPeriod period is undefined', store.periods[i]);
                continue;
            }

            if(store.periods[i].from <= from && store.periods[i].to >= to) {
                debug('YES1  hasAvailabilityForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
                return true;
            }
            else if(store.periods[i].from >= from && store.periods[i].to <= to) {
                debug('YES2  hasAvailabilityForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
                return true;
            }
            else if(store.periods[i].from <= from && store.periods[i].to >= from && store.periods[i].to <= to) {
                debug('YES3  hasAvailabilityForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
                return true;
            }
            else if(store.periods[i].from >= from && store.periods[i].from <= to && store.periods[i].to >= to) {
                debug('YES3  hasAvailabilityForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
                return true;
            }
        }

        debug('NO4   hasAvailabilityForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
        return false;
    };

    this.isAvailableForPeriod = function(from, to, timezone) {
        if(store.firstAvailable <= from && store.lastAvailable >= to) {
            // falls within the general available times for the day, check each period
            for(var i=0; i<store.periods.length; i++) {
                if(!store.periods[i]) {
                    console.log(store.logInfo, 'availability-store#isAvailableForPeriod period is undefined', store.periods[i]);
                    continue;
                }

                if(store.periods[i].from > to) {
                    // this period is past the time we're checking, stop (as store.periods is always ascending in time)
                    debug('NO1   isAvailableForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
                    return false;
                }
                else if(store.periods[i].from <= from && store.periods[i].to >= to) {
                    debug('YES  isAvailableForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
                    return true;
                }
            }
        }
        
        // not available
        debug('NO2  isAvailableForPeriod '+moment(from, 'X').format()+'-'+moment(to, 'X').format(), from, to);
        return false;
    };
};

module.exports = AvailabilityStore;