import { ScaleLinear, ScaleTime } from 'd3-scale';
import { extent } from 'd3-array';

import { scaleLinear, scaleTime } from '@visx/scale';

import { GraphSeries } from '../types';

import { isPredicted } from './dataPoint';

export function createYScale(
  plot: GraphSeries,
  height: number,
  padding = 0,
): ScaleLinear<number, number> {
  const values = plot.data.map((datum) => datum.value);
  const minValues = plot.data.map((datum) => (isPredicted(datum) ? datum.minValue : datum.value));
  const maxValues = plot.data.map((datum) => (isPredicted(datum) ? datum.maxValue : datum.value));

  const yScaleRange = [padding, height + padding];

  return scaleLinear({
    domain: plot.domain || [
      Math.max(...values, ...minValues, ...maxValues),
      Math.min(...values, ...minValues, ...maxValues),
    ],
    range: yScaleRange,
    round: false,
  });
}

export function createXScale(dates: Date[], width = 0): ScaleTime<number, number> {
  if (dates.length < 2) {
    throw new Error('Too little dates given');
  }

  return scaleTime({
    domain: extent(dates) as [Date, Date],
    range: [0, width],
    round: true,
  });
}
