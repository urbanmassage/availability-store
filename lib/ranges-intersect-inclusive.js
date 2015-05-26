var sanitizeRange = require('./sanitize-range');
var rangeIsEmpty = require('./range-is-empty');
var rangeCompletelyContainsRange = require('./range-completely-contains-range');

var debug = require('debug')('availability-store:ranges-intersect-inclusive');

var rangesIntersectInclusive = function rangesIntersectInclusive(r1, r2) {
    // flip the ranges if necessary
    sanitizeRange(r1);
    sanitizeRange(r2);

    // if either range is empty then they cannot intersect
    if(rangeIsEmpty(r1) === true) {
        debug('rangeIsEmpty(r1)', r1);
        return false;
    }
    if(rangeIsEmpty(r2) === true) {
        debug('rangeIsEmpty(r2)', r2);
        return false;
    }

    if(rangeCompletelyContainsRange(r1, r2)) {
        // r1 ------
        // r2  ----

        debug('rangeCompletelyContainsRange(r1,r2)', r1, r2);
        return true;
    }
    else if(rangeCompletelyContainsRange(r2, r1)) {
        // r1  ----
        // r2 ------
        
        debug('rangeCompletelyContainsRange(r2,r1)', r1, r2);
        return true;
    }
    else if(r1.from === r2.from && r1.to === r2.to) {
        // r1 ------
        // r2 ------
        
        debug('e', r1, r2);
        return true;
    }
    else if(r1.from < r2.from && r1.to > r2.from && r1.to < r2.to) {
        // r1 ------
        // r2    ----
        
        debug('f', r1, r2);
        return true;
    }
    else if(r1.from > r2.from && r1.from < r2.to && r1.to > r2.to) {
        // r1  ------
        // r2 ----
        
        debug('g', r1, r2);
        return true;
    }
    
    return false;
};

module.exports = rangesIntersectInclusive;