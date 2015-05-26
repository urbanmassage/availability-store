var sanitizeRange = require('./sanitize-range');
var sortRanges = require('./sort-ranges');

var debug = require('debug')('availability-store:latest-in-ranges');

var kDefaultLatest = 0;

// this method removes a range from a set of ranges
var latestInRanges = function latestInRanges(ranges) {
    var latest = kDefaultLatest;

    for(var i=0; i<ranges.length; i++) {
        if(ranges[i].to > latest) {
            latest = ranges[i].to;
        }
    }

    return latest;
};

module.exports = latestInRanges;