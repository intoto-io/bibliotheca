import { GraphSeries } from '@intoto-dev/bibliotheca-graph';

import formatObservationValue from './formatObservationValue';
import { AppLang, ObservationType } from './types';

export function observationTypeToSeriesProperties(type: ObservationType, locale: AppLang): Partial<GraphSeries> {
  const defaultProperties = {
    formatValue: (value: number) => formatObservationValue(value, locale),
  };

  switch (type) {
    case 'water-level':
      return {
        ...defaultProperties,
        color: '#2196f3',
        formatValue: (value) => formatObservationValue(value, locale),
      };
    case 'water-flow':
      return {
        ...defaultProperties,
        color: '#2196f3',
        formatValue: (value) => formatObservationValue(value, locale, 1),
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
