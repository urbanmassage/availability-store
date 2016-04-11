import {expect} from 'chai';
import AvailabilityStore = require('../');

describe('availability-store', function() {
  var availabilityStore = new AvailabilityStore();

  it('should not contain any periods straight after initiation', function() {
    expect(availabilityStore.periods.length).to.equal(0);
  });

  it('should contain one period after adding [100-200]', function() {
    availabilityStore.forceAvailableForPeriod(100, 200);

    expect(availabilityStore.periods.length).to.equal(1);
  });

  it('should contain two period after adding [10-30]', function() {
    availabilityStore.forceAvailableForPeriod(10, 30);

    expect(availabilityStore.periods.length).to.equal(2);
  });

  it('should contain three period after adding [50-60]', function() {
    availabilityStore.forceAvailableForPeriod(50, 60);

    expect(availabilityStore.periods.length).to.equal(3);
  });

  it('should contain four period after adding [220-260]', function() {
    availabilityStore.forceAvailableForPeriod(220, 260);

    expect(availabilityStore.periods.length).to.equal(4);
  });

  it('should contain four period after adding [140-210]', function() {
    availabilityStore.forceAvailableForPeriod(140, 210);

    expect(availabilityStore.periods.length).to.equal(4);
  });
});