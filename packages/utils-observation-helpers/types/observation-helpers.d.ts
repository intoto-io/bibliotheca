declare global {
  interface ObservationRecord {
    date: Date;
    values: Array<number | null>;
  }
}

export {};
