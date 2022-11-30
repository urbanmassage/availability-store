export interface IPeriod {
  from: number;
  to: number;
}

export interface ILogItem { action: 'add' | 'remove', reason: string, from: number, to: number };

export interface IAvailabilityStore {
  periods: IPeriod[];
  log: ILogItem[];
  firstAvailable: number;
  lastAvailable: number;
}
