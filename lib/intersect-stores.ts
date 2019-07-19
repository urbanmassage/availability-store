import AvailabilityStore = require('../');

function intersectStores(
  store1: AvailabilityStore,
  store2: AvailabilityStore,
  newStore: AvailabilityStore,
): AvailabilityStore {
  if (!store1.periods.length || !store2.periods.length) {
    return newStore;
  }

  const steps: number[] = [...store1.periods, ...store2.periods]
    // convert into array
    .reduce<number[]>((all, { from, to }) => all.concat(from, to), [])
    // de-dupe
    .filter((item, index, array) => array.indexOf(item) === index)
    .sort();

  /** last value of checking whether there's an intersection */
  let lastValue = false;
  steps.forEach((step, index) => {
    if (index === 0) return;

    // performance hack: we should never have a step in the middle of an
    //   intersection so we can safely ignore the range after an intersection
    if (lastValue === true) {
      lastValue = false;
      return;
    }

    let prevStep = steps[index - 1];
    if (
      store1.isAvailableForPeriod(prevStep, step) &&
      store2.isAvailableForPeriod(prevStep, step)
    ) {
      lastValue = true;
      newStore.forceAvailableForPeriod(prevStep, step);
    }
  });

  return newStore;
}

export = intersectStores;
