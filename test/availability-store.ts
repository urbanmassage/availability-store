import {expect} from 'chai';
import AvailabilityStore = require('../');

describe('availability-store', function() {
  var availabilityStore = new AvailabilityStore();

  it('should not contain any periods straight after initiation', function() {
    expect(availabilityStore.periods.length).to.equal(0);
  });

  it('should contain one period after adding [10-99]', function() {
    availabilityStore.forceAvailableForPeriod(10, 99);

    expect(availabilityStore.periods.length).to.equal(1);
  });

  it('should return true for isAvailableForPeriod(20,30)', function() {
    var result = availabilityStore.isAvailableForPeriod(20, 30);

    expect(result).to.equal(true);
  });

  it('should return false for isAvailableForPeriod(1,30)', function() {
    var result = availabilityStore.isAvailableForPeriod(1, 30);

    expect(result).to.equal(false);
  });

  it('should serialize correctly', function() {
    var result = availabilityStore.serialize();

    expect(JSON.stringify(result)).to.equal('[{"from":10,"to":99}]');
  });

  it('should contain two periods after adding [200-300]', function() {
    availabilityStore.forceAvailableForPeriod(200, 300);

    expect(availabilityStore.periods.length).to.equal(2);
  });

  it('should return true for hasAvailabilityForPeriod(200,350)', function() {
    var result = availabilityStore.hasAvailabilityForPeriod(200, 350);

    expect(result).to.equal(true);
  });

  it('should return false for hasAvailabilityForPeriod(100,150)', function() {
    var result = availabilityStore.hasAvailabilityForPeriod(100, 150);

    expect(result).to.equal(false);
  });

  it('should still contain two periods after adding [200-350]', function() {
    availabilityStore.forceAvailableForPeriod(200, 350);

    expect(availabilityStore.periods.length).to.equal(2);
  });

  it('should still serialize correctly', function() {
    var result = availabilityStore.serialize();

    expect(JSON.stringify(result)).to.equal('[{"from":10,"to":99},{"from":200,"to":350}]');
  });

  it('should contain one period after removing [10-99]', function() {
    availabilityStore.markUnavailableForPeriod(10, 99);

    expect(availabilityStore.periods.length).to.equal(1);
  });

  it('should work for string timestamps', function() {
    var store = new AvailabilityStore();
    store.forceAvailableForPeriod('1432884600', '1432890000');
    store.markUnavailableForPeriod(1432884600, 1432890000);

    expect(store.periods.length).to.equal(0);
  });
});
