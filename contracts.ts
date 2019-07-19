export interface IPeriod {
  from: number;
  to: number;
}

export interface IAvailabilityStore {
  periods: IPeriod[];
  firstAvailable: number;
  lastAvailable: number;
}
