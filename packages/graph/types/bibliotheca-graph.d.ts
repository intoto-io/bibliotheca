import { CurveFactory } from 'd3-shape';

declare global {
  interface BaseDataPoint {
    value: number;
    date: Date;
  }

  interface MissingDataPoint extends BaseDataPoint {
    missing: true;
  }

  interface PredictedDataPoint extends BaseDataPoint {
    predicted: true;
    minValue: number;
    maxValue: number;
  }

  type DataPoint = BaseDataPoint | MissingDataPoint | PredictedDataPoint;

  type SeriesType = 'line' | 'bar';

  type ThresholdDirection = 'up' | 'down';

  interface GraphSeries {
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
}

export {};
