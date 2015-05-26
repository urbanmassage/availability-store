var sanitizeRange = require('./sanitize-range');
var rangeIsEmpty = require('./range-is-empty');
var earliestInRanges = require('./earliest-in-ranges');
var latestInRanges = require('./latest-in-ranges');
var rangesIntersectInclusive = require('./ranges-intersect-inclusive');
var sortRanges = require('./sort-ranges');

var debug = require('debug')('availability-store:ranges-after-removing-range');

// this method removes a range from a set of ranges
var rangesAfterRemovingRange = function rangesAfterRemovingRange(ranges, rangeToRemove) {
    // if ranges is empty, it cannot contain the rangeToRemove
    if(ranges.length === 0) {
        return ranges;
    }

    // if rangeToRemove is empty, no need to process ranges
    if(rangeIsEmpty(rangeToRemove)) {
        debug('rangeIsEmpty(rangeToRemove)', rangeToRemove);

        return ranges;
    }

    sanitizeRange(rangeToRemove);

    var earliest = earliestInRanges(ranges);
    if(rangeToRemove.to < earliest) {
        // rangeToRemove is before all ranges passed in
        // do nothing!

        debug('rangeToRemove.to < earliest', ranges, rangeToRemove);

        return ranges;
    }

    var latest = latestInRanges(ranges);
    if(rangeToRemove.from > latest) {
        // rangeToRemove is after all ranges passed in
        // do nothing!

        debug('rangeToRemove.from > latest', ranges, rangeToRemove);

        return ranges;
    }

    // if we hit here then rangeToRemove must overlap the passed ranges in some way
    var output = [];

    for(var i=0; i<ranges.length; i++) {
        if(!rangesIntersectInclusive(ranges[i], rangeToRemove)) {
            // rangeToRemove isn't within this range, skip
            output.push(ranges[i]);
        }
        else {
            // if we hit here, ranges[i] must intersect rangeToRemove

            if(rangeToRemove.from <= ranges[i].from && rangeToRemove.to >= ranges[i].to) {
                // +   --------
                // -  ----------
                // =        
                // covers more than period, drop period
                
                // +   --------
                // -   --------
                // =    
                // exactly covers period, drop period
            }
            else if(rangeToRemove.from > ranges[i].from && rangeToRemove.from < ranges[i].to && rangeToRemove.to > ranges[i].to) {
                // +  -----
                // -     -----
                // =  ---

                ranges[i].to = rangeToRemove.from;
                output.push(ranges[i]);
            }
            else if(rangeToRemove.from < ranges[i].from && rangeToRemove.to > ranges[i].from && rangeToRemove.to < ranges[i].to) {
                // +     -----
                // -  -----
                // =       ---

                ranges[i].from = rangeToRemove.to;
                output.push(ranges[i]);
            }
            else {
                // rangeToRemove is completely within ranges[i]
                // +   -----------------
                // -     ----
                // =   --    
                // =         -----------

                var firstPartOfSplit = {
                    from: ranges[i].from,
                    to: rangeToRemove.from
                };
                var secondPartOfSplit = {
                    from: rangeToRemove.to,
                    to: ranges[i].to
                };

                if(!rangeIsEmpty(firstPartOfSplit)) {
                    output.push(firstPartOfSplit);
                }
                if(!rangeIsEmpty(secondPartOfSplit)) {
                    output.push(secondPartOfSplit);
                }
            }
        }
    }

    sortRanges(output);

    return output;
};

module.exports = rangesAfterRemovingRange;