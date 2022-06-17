import { GraphSeries } from '../types';

export function tickFormat(
  { unit, formatValue = (v) => v }: GraphSeries,
  value: number,
): string {
  return unit ? `${formatValue(value)}${unit}` : formatValue(value).toString();
}

export function changeFormat(
  { unit, formatChange = (v) => v }: GraphSeries,
  value: number,
): string {
  return unit ? `${formatChange(value)}${unit}` : formatChange(value).toString();
}
