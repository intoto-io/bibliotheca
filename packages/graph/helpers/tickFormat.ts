import { GraphSeries } from '../types';

function tickFormat(
  { unit, formatValue = (v) => v }: GraphSeries,
  value: number,
): string {
  return unit ? `${formatValue(value)}${unit}` : formatValue(value).toString();
}

export default tickFormat;
