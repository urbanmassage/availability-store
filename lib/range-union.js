var sanitizeRange = require('./sanitize-range');

var calculateRangeUnion = function calculateRangeUnion(range1, range2) {
	// flip the ranges if necessary
	sanitizeRange(range1);
	sanitizeRange(range2);

    return {
        from: (range1.from < range2.from ? range1.from : range2.from),
        to: (range1.to > range2.to ? range1.to : range2.to)
    };
};

module.exports = calculateRangeUnion;