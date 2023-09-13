import { ThresholdDirection } from '../types';

import { valueInThreshold } from './hasValueInThreshold';

function colorByThreshold(
  value: number,
  threshold?: number,
  thresholdColor = '#000',
  thresholdDirection: ThresholdDirection = 'up',
  fallback = '#000',
): string {
  if (typeof threshold !== 'undefined') {
    if (valueInThreshold(value, threshold, thresholdDirection)) {
      return thresholdColor;
    }
  }

  return fallback;
}

export default colorByThreshold;
