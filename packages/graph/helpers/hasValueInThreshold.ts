export function valueInThreshold(
  value: number,
  threshold: number,
  thresholdDirection = 'up',
): boolean {
  return (value > threshold && thresholdDirection === 'up')
    || (value < threshold && thresholdDirection === 'down');
}

function hasValueInThreshold(
  data: DataPoint[],
  threshold?: number,
  thresholdDirection = 'up',
): boolean {
  if (typeof threshold === 'undefined') {
    return false;
  }

  return data.some((datum) => valueInThreshold(datum.value, threshold, thresholdDirection));
}

export default hasValueInThreshold;
