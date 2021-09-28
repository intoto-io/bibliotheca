export interface ObservationRecord {
  date: Date;
  values: Array<number | null>;
}

export type ObservationType = 'water-level' | 'water-temperature' | 'water-ph';

export type AppLang = 'nb' | 'en';
