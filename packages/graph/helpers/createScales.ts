import { ScaleLinear, ScaleTime } from 'd3-scale';
import { extent } from 'd3-array';

import { scaleLinear, scaleTime } from '@visx/scale';

import { GraphSeries } from '../types';

import { isPredicted } from './dataPoint';

export function createYScale(
  plot: GraphSeries,
  height: number,
  extraValues: number[] = [],
  padding = 0,
): ScaleLinear<number, number> {
  const values = plot.data.map((datum) => datum.value);
  const minValues = plot.data.map((datum) => (isPredicted(datum) ? datum.minValue : datum.value));
  const maxValues = plot.data.map((datum) => (isPredicted(datum) ? datum.maxValue : datum.value));

  const yScaleRange = [padding, height + padding];

  const max = Math.max(...values, ...minValues, ...maxValues, ...extraValues);
  const min = typeof plot.bottom !== 'undefined'
    ? plot.bottom
    : Math.min(...values, ...minValues, ...maxValues, ...extraValues);
  const domainPadding = (max - min) * 0.2;
  const domainPaddingBottom = typeof plot.bottom !== 'undefined' ? 0 : domainPadding;

  return scaleLinear({
    domain: plot.domain || [
      max + domainPadding,
      min - domainPaddingBottom,
    ],
    range: yScaleRange,
    round: true,
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
