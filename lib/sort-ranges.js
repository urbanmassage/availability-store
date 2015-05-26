var sanitizeRange = require('./sanitize-range');

var debug = require('debug')('availability-store:sort-ranges');

var sortRanges = function sortRanges(ranges) {
    for(var i=0; i<ranges.length; i++) {
        sanitizeRange(ranges[i]);
    }

    ranges.sort(function(a, b) {
        if(a.from > b.from) {
            return 1;
        }
        else {
            return -1;
        }
    });
};

module.exports = sortRanges;