import {
  addDays,
  compareDesc,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
} from 'date-fns';

import { isUniqueDate } from '@intoto-dev/utils-is-unique-date';

import { GraphSeries } from '../types';

interface UseSeriesFacts {
  dates: Date[];
  minutesCount: number;
  hoursCount: number;
  diffEnd: number;
  dataPointsPerDay: number;
}

function useSeriesFacts(series: GraphSeries[]): UseSeriesFacts {
  const dates = series
    .reduce(
      (acc: Date[], plot) => [
        ...acc,
        ...plot.data
          // get all dates from data series
          .map((datum) => new Date(datum.date))
          // filter out the duplicates
          .filter((date) => isUniqueDate(date, acc)),
      ],
      [],
    ).sort((a, b) => compareDesc(a, b));

  const hoursCount: number = differenceInHours(dates[0], dates[dates.length - 1]);
  const minutesCount: number = differenceInMinutes(dates[0], dates[dates.length - 1]);

  const dataPointsPerDay = series.reduce((maxFromPlot, plot) => {
    const dateCounts: Record<string, number> = plot.data
      .reduce((plotAcc: Record<string, number>, datum) => {
        const s = startOfDay(new Date(datum.date)).toISOString();

        return {
          ...plotAcc,
          [s]: plotAcc[s] ? plotAcc[s] + 1 : 1,
        };
      }, {});

    const max = Math.max(...Object.values(dateCounts));

    if (max > maxFromPlot) {
      return max;
    }

    return maxFromPlot;
  }, 0);

  const diffEnd = differenceInHours(startOfDay(addDays(dates[0], 1)), dates[0]) % 24;

  return {
    dates,
    diffEnd,
    hoursCount,
    minutesCount,
    dataPointsPerDay,
  };
}

export default useSeriesFacts;
