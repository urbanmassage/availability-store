var rangesIntersect = function rangesIntersect(r1, r2) {
    if(!r1 || !r2) {
        // one of the ranges are undefined??
        console.log('availability-store range is undefined', r1, r2);

        return false;
    }

    // check range1 is correct way around
    if(r1.from > r1.to) {
        var r1To = r1.from;
        r1.from = r1.to;
        r1.to = r1To;
    }
    // check range2 is correct way around
    if(r2.from > r2.to) {
        var r2To = r2.from;
        r2.from = r2.to;
        r2.to = r2To;
    }
    
    var e1start = r1.from;
    var e2start = r2.from;
    var e1end = r1.to;
    var e2end = r2.to;

    if(r1.from <= r2.from && r1.to >= r2.to) {
        return true;
    }
    else if(r1.from >= r2.from && r1.to <= r2.to) {
        return true;
    }
    else if(r1.from <= r2.from && r1.to >= r2.from && r1.to <= r2.to) {
        return true;
    }
    else if(r1.from >= r2.from && r1.from <= r2.to && r1.to >= r2.to) {
        return true;
    }
    
    return false;
};

module.exports = rangesIntersect;