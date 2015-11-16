const DEFAULT_LATEST = 0;

// this method removes a range from a set of ranges
function latestInRanges(ranges) {
    let latest = DEFAULT_LATEST;

    for(let i=0; i<ranges.length; i++) {
        if(ranges[i].to > latest) {
            latest = ranges[i].to;
        }
    }

    return latest;
};

export = latestInRanges;
