import { CurveFactory } from 'd3-shape';

export interface BaseDataPoint {
  value: number;
  date: Date;
}

export interface MissingDataPoint extends BaseDataPoint {
  missing: true;
}

export interface PredictedDataPoint extends BaseDataPoint {
  predicted: true;
  minValue: number;
  maxValue: number;
}

export type DataPoint = BaseDataPoint | MissingDataPoint | PredictedDataPoint;

export type SeriesType = 'line' | 'bar';

export type ThresholdDirection = 'up' | 'down';

export interface GraphSeries {
  key: string;
  data: DataPoint[];
  type?: SeriesType;
  name?: string;
  color?: string;
  threshold?: number;
  thresholdColor?: string;
  thresholdDirection?: ThresholdDirection;
  domain?: number[];
  labelWidth?: number;
  axisHeight?: number;
  barWidth?: number;
  barPadding?: number;
  barOpacity?: number;
  unit?: string;
  formatValue?: (value: number) => number | string;
  curve?: CurveFactory;
}
