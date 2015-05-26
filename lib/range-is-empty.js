var sanitizeRange = require('./sanitize-range');

var rangeIsEmpty = function rangeIsEmpty(range) {
    // flip the range if necessary
    sanitizeRange(range);

    if(range.from === range.to) {
        return true;
    }
    
    return false;
};

module.exports = rangeIsEmpty;