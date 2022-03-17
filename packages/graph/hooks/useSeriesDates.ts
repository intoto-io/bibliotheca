import { compareDesc } from 'date-fns';

import { isUniqueDate } from '@intoto-dev/utils-is-unique-date';

import { GraphSeries } from '../types';

function useSeriesDates(series: GraphSeries[]): Date[] {
  return series
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
}

export default useSeriesDates;
