import { expect } from 'chai';
import AvailabilityStore = require('../');
import intersectStores = require('../lib/intersect-stores');

describe('intersect-stores', function() {
  it('works with empty stores', () => {
    const value = intersectStores(
      new AvailabilityStore(),
      new AvailabilityStore(),
      new AvailabilityStore(),
    );

    expect(value).to.be.an.instanceof(AvailabilityStore);
    expect(value)
      .to.have.property('periods')
      .that.deep.equals([]);
  });

  it('works with one empty store', () => {
    const store1 = new AvailabilityStore();
    const store2 = new AvailabilityStore();

    store1.setupFromCachedPeriods([
      { from: 0, to: 1 },
      { from: 2, to: 3 },
      { from: 4, to: 5 },
      { from: 6, to: 7 },
      { from: 9, to: 10 },
    ]);

    const value = intersectStores(store1, store2, new AvailabilityStore());

    expect(value).to.be.an.instanceof(AvailabilityStore);
    expect(value)
      .to.have.property('periods')
      .that.deep.equals([]);
  });

  it('works with non-empty stores', () => {
    const store1 = new AvailabilityStore();
    const store2 = new AvailabilityStore();

    store1.setupFromCachedPeriods([
      { from: 0, to: 1 },
      { from: 2, to: 3 },
      { from: 4, to: 5 },
      { from: 6, to: 7 },
      { from: 9, to: 10 },
    ]);
    store2.setupFromCachedPeriods([
      { from: 0, to: 1 },
      { from: 4, to: 6 },
      { from: 7, to: 9 },
    ]);

    const value = intersectStores(store1, store2, new AvailabilityStore());

    expect(value).to.be.an.instanceof(AvailabilityStore);
    expect(value)
      .to.have.property('periods')
      .that.deep.equals([{ from: 0, to: 1 }, { from: 4, to: 5 }]);
  });
});
