import sanitizeRange = require('./sanitize-range');
import rangeIsEmpty = require('./range-is-empty');

var debug = require('debug')('availability-store:ranges-adjoin');

function rangesAdjoin(r1, r2) {
  // flip the ranges if necessary
  sanitizeRange(r1);
  sanitizeRange(r2);

  // if either range is empty then they cannot adjoin
  if (rangeIsEmpty(r1) === true) {
    debug('rangeIsEmpty(r1)', r1);
    return false;
  }
  if (rangeIsEmpty(r2) === true) {
    debug('rangeIsEmpty(r2)', r2);
    return false;
  }

  if (r1.from === r2.to) {
    // r1     ---
    // r2  ---
    return true;
  }

  if (r1.to === r2.from) {
    // r1  ---
    // r2     ---
    return true;
  }

  return false;
}

export = rangesAdjoin;
