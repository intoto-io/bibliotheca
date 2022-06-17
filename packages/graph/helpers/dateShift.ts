import { addMinutes } from 'date-fns';

import { GraphSeries } from '../types';

const match = /Z$|([+-])[0-2][0-9]:[0-5][0-9]$/;

export function getTimezoneOffset(date: string): number {
  const matches = date.match(match);

  // if timezone is UTC
  if (matches === null || matches[0] === 'Z') {
    return 0;
  }

  const isPositive = matches[1] === '+';
  const hours = parseInt(matches[0].substr(1, 2), 10);
  const minutes = parseInt(matches[0].substr(4, 2), 10);

  if (hours === 0 && minutes === 0) {
    return 0;
  }

  return ((hours * 60) + minutes) * (isPositive ? -1 : 1);
}

export function shiftDate(date: string, direction: 1 | -1 = 1): string {
  const offset = getTimezoneOffset(date);

  const localOffset = new Date(date).getTimezoneOffset();

  const shift = localOffset - (offset * direction);

  return addMinutes(new Date(date), shift).toISOString();
}

export function shiftSeriesDates(series: GraphSeries[]): GraphSeries[] {
  return series.map((s) => {
    const { data } = s;

    return {
      ...s,
      data: data.map((d) => ({
        ...d,
        date: shiftDate(d.date),
      })),
    };
  });
}
