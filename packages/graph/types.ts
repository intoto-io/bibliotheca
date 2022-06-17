import { CurveFactory } from 'd3-shape';
import { ComponentClass, FunctionComponent } from 'react';

export interface BaseDataPoint {
  value: number;
  date: string;
  minValue?: number;
  maxValue?: number;
  change?: {
    '1h': number;
    '24h': number;
  },
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

export interface TooltipValues {
  values: DataPoint[];
  x: number;
  y: number;
  tx: number;
  ty: number;
}

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
  tooltipExtra?: FunctionComponent<{ point: DataPoint }> | ComponentClass<{ point: DataPoint }>;
  curve?: CurveFactory;
  area?: boolean;
  bottom?: number;
}
