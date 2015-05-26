var sanitizeRange = require('./sanitize-range');
var rangeIsEmpty = require('./range-is-empty');

var debug = require('debug')('availability-store:range-completely-contains-range');

// TODO!
var rangeCompletelyContainsRange = function rangeCompletelyContainsRange(outerRange, innerRange) {
    // flip the ranges if necessary
    sanitizeRange(outerRange);
    sanitizeRange(innerRange);

    if(rangeIsEmpty(outerRange)) {
        debug('rangeIsEmpty(outerRange)', outerRange);
        return false;
    }

    if(outerRange.from < innerRange.from && outerRange.to > innerRange.to) {
        // o ------
        // i  ----

        debug('a', outerRange, innerRange);
        return true;
    }
    else if(outerRange.from === innerRange.from && outerRange.to === innerRange.to) {
        // o ------
        // i ------

        debug('b', outerRange, innerRange);
        return true;
    }
    else if(outerRange.from === innerRange.from && outerRange.to > innerRange.to) {
        // o ------
        // i ----
        
        debug('c', outerRange, innerRange);
        return true;
    }
    else if(outerRange.from < innerRange.from && outerRange.to === innerRange.to) {
        // o ------
        // i   ----
        
        debug('d', outerRange, innerRange);
        return true;
    }

    return false;
};

module.exports = rangeCompletelyContainsRange;