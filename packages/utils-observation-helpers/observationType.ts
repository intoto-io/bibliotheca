import { GraphSeries } from '@intoto-dev/bibliotheca-graph/types';

import formatObservationValue from './formatValue';
import { AppLang, ObservationType } from './types';

export function observationTypeToUnit(type: ObservationType): string | undefined {
  if (type === 'water-temperature') {
    return '°C';
  }

  return undefined;
}

export function observationTypeToSeriesProperties(
  type: ObservationType,
  locale: AppLang,
): Partial<GraphSeries> {
  const defaultProperties = {
    unit: observationTypeToUnit(type),
    formatValue: (value: number) => formatObservationValue(value, locale),
  };

  switch (type) {
    case 'water-level':
      return {
        ...defaultProperties,
        color: '#2196f3',
        formatValue: (value) => formatObservationValue(value, locale),
      };
    case 'water-temperature':
      return {
        ...defaultProperties,
        color: '#ce1836',
        threshold: 0,
        thresholdColor: '#00f',
        thresholdDirection: 'down',
        type: 'bar',
        formatValue: (value) => formatObservationValue(value, locale, 0),
      };
    case 'water-ph':
      return {
        ...defaultProperties,
        color: '#009c0d',
        formatValue: (value) => formatObservationValue(value, locale, 1),
      };
    default:
      return defaultProperties;
  }
}
