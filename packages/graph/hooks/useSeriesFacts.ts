import {
  compareDesc, differenceInDays, isSameDay, startOfDay,
} from 'date-fns';

import { isUniqueDate } from '@intoto-dev/utils-is-unique-date';

import { GraphSeries } from '../types';

interface UseSeriesFacts {
  dates: Date[];
  numberOfDays: number;
  dataPointsPerDay: number;
  lastDayEntryMissing: number;
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

  const numberOfDays: number = differenceInDays(dates[0], dates[dates.length - 1]);

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

  const lastDayEntryMissing = dataPointsPerDay
    - Math.min(...series.reduce((acc: number[], plot) => {
      const items = plot.data.filter((d) => isSameDay(new Date(d.date), dates[0]));

      return [...acc, items.length];
    }, []))
    + 1;

  return {
    dates,
    numberOfDays,
    dataPointsPerDay,
    lastDayEntryMissing,
  };
}

export default useSeriesFacts;
