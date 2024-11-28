export interface ObservationRecord {
  date: Date;
  values: Array<number | null>;
  min?: Array<number | null>;
  max?: Array<number | null>;
}

export type ObservationType = 'water-level' | 'water-flow' | 'water-temperature' | 'water-ph';

export type AppLang = 'nb' | 'en' | 'sv' | 'da' | 'fi';
