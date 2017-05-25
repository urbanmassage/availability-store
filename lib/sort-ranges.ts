import {IAvailabilityStore} from '../contracts';
import sanitizeRange = require('./sanitize-range');
const DEFAULT_EARLIEST: number = 0;
const DEFAULT_LATEST = 0;


function sortRangesOnStore(availabilityStore: IAvailabilityStore): void {
  availabilityStore.periods = availabilityStore.periods
    .filter(p => !!p && p.from !== p.to)
    .map(p => {
      sanitizeRange(p);
      return p;
    })
    .sort((a, b) => a.from - b.from);

    if (availabilityStore.periods.length){
      availabilityStore.firstAvailable = availabilityStore.periods[0].from;

      availabilityStore.lastAvailable = DEFAULT_LATEST;
      availabilityStore.periods.forEach(period => {
        if (period.to > availabilityStore.lastAvailable) {
          availabilityStore.lastAvailable = period.to;
        }
      });

    } else {
      availabilityStore.firstAvailable = DEFAULT_EARLIEST;
      availabilityStore.lastAvailable = DEFAULT_LATEST;
    }
};

export = sortRangesOnStore;
