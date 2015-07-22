var sanitizeRange = require('./sanitize-range');
var rangeIsEmpty = require('./range-is-empty');
var sortRanges = require('./sort-ranges');
var rangesIntersectInclusive = require('./ranges-intersect-inclusive');
var calculateRangeUnion = require('./range-union');
var earliestInRanges = require('./earliest-in-ranges');
var latestInRanges = require('./latest-in-ranges');
var rangesAdjoin = require('./ranges-adjoin');

var debug = require('debug')('availability-store:ranges-after-adding-range');

// this method removes a range from a set of ranges
var rangesAfterAddingRange = function rangesAfterAddingRange(ranges, rangeToAdd) {
    sanitizeRange(rangeToAdd);

    // if rangeToAdd is empty, no need to process ranges
    if(rangeIsEmpty(rangeToAdd)) {
        return ranges;
    }

    // if ranges is empty, simply return the new range
    if(ranges.length === 0) {
        return [rangeToAdd];
    }

    var earliest = earliestInRanges(ranges);
    if(rangeToAdd.to < earliest) {
        // rangeToRemove is before all ranges passed in
        // just pop the range in and re sort

        debug('rangeToAdd.to < earliest', ranges, rangeToAdd);

        ranges.push(rangeToAdd);
        sortRanges(ranges);
        return ranges;
    }

    var latest = latestInRanges(ranges);
    if(rangeToAdd.from > latest) {
        // rangeToAdd is after all ranges passed in
        // just pop the range in and re sort

        debug('rangeToAdd.from > latest', ranges, rangeToAdd);

        ranges.push(rangeToAdd);
        sortRanges(ranges);
        return ranges;
    }

    // it looks like we need to process the ranges if we hit here
    var output = [],
        added = false;

    for(var i=0; i<ranges.length; i++) {
        if(!rangesIntersectInclusive(ranges[i], rangeToAdd) && !rangesAdjoin(ranges[i], rangeToAdd)) {
            // ranges[i] doesn't overlap rangeToAdd, just pop it back in output
            output.push(ranges[i]);
        } else {
            // merge multiple ranges...
            if( added ) {
              rangeToAdd = output.pop();
            }

            // the ranges overlap, calculate the range union
            var union = calculateRangeUnion(ranges[i], rangeToAdd);

            output.push(union);
            added = true;
        }
    }
    if( ! added ) {
        output.push(rangeToAdd);
    }

    sortRanges(output);

    return output;
};

module.exports = rangesAfterAddingRange;