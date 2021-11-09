import { GraphSeries } from '../types';
import { addHours, addMinutes, subMinutes } from 'date-fns';

const match = /Z$|([+\-])[0-2][0-9]:[0-5][0-9]$/;

export function getTimezoneOffset(date: string): number {
  const matches = date.match(match);

  // if timezone is UTC
  if (matches === null || matches[0] === 'Z') {
    return 0;
  }

  const isPositive = matches[1] === '+';
  const hours = parseInt(matches[0].substr(1, 2), 10);
  const minutes = parseInt(matches[0].substr(4, 2), 10);

  return ((hours * 60) + minutes) * (isPositive ? -1 : 1);
}

export function shiftSeriesDates(series: GraphSeries[]): GraphSeries[] {
  return series.map((s) => {
    const { data } = s;

    const dateLocal = new Date(data[0].date);
    const localOffset = dateLocal.getTimezoneOffset();
    const offset = getTimezoneOffset(data[0].date);

    if (offset === 0) {
      return s;
    }

    return {
      ...s,
      data: data.map((d) => ({
        ...d,
        date: addMinutes(subMinutes(new Date(d.date), offset), localOffset).toISOString(),
      })),
    };
  });
}
