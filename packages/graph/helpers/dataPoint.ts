export function createDataPoint(point: BaseDataPoint): BaseDataPoint {
  return point;
}

export function createMissingDataPoint(point: BaseDataPoint): MissingDataPoint {
  return {
    missing: true,
    ...point,
  };
}

export function createPredictedDataPoint(
  point: Omit<PredictedDataPoint, 'predicted'>,
): PredictedDataPoint {
  return {
    predicted: true,
    ...point,
  };
}

export function isMissing(datum: DataPoint): datum is MissingDataPoint {
  return 'missing' in datum && datum.missing;
}

export function isPredicted(datum: DataPoint): datum is PredictedDataPoint {
  return 'predicted' in datum && datum.predicted;
}
