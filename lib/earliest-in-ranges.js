var sanitizeRange = require('./sanitize-range');
var sortRanges = require('./sort-ranges');

var debug = require('debug')('availability-store:earliest-in-ranges');

var kDefaultEarliest = 0;

// this method removes a range from a set of ranges
var earliestInRanges = function earliestInRanges(ranges) {
    // if ranges is empty, simply return the new range
    if(ranges.length === 0) {
        return kDefaultEarliest;
    }

    // make sure the ranges are in order
    sortRanges(ranges);

    // as the ranges are sorted by the 'from' property, we can now safely assume that ranges[0].from is the earliest time
    return ranges[0].from;
};

module.exports = earliestInRanges;