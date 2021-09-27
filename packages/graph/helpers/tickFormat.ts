import { GraphSeries } from '../types';

function tickFormat({ unit, formatValue = (value) => value }: GraphSeries, tick: number): string {
  return unit ? `${formatValue(tick)}${unit}` : formatValue(tick).toString();
}

export default tickFormat;
