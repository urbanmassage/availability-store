var sanitizeRange = function(range) {
	if(range.from > range.to) {
		var oldRangeFrom = range.from;
		range.from = range.to;
		range.to = oldRangeFrom;
	}
};

module.exports = sanitizeRange;