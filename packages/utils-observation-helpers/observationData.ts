import { setHours } from 'date-fns';
import { isMissing } from '@intoto-dev/bibliotheca-graph';
import { DataPoint } from '@intoto-dev/bibliotheca-graph/lib/types';

import { ObservationRecord } from './types';

export function observationDataToLineData(data: ObservationRecord[]): DataPoint[] {
  const now = new Date();

  return data.reduce((acc: DataPoint[], day) => {
    const { date, values } = day;

    return values
      .reduceRight((points, value, index) => {
        const hours = index * (24 / values.length);
        const newDate = setHours(date, hours);

        if (value === null && now < newDate) {
          return points;
        }

        return [
          ...points,
          {
            date: newDate,
            value: value || 0,
            missing: value === null,
          },
        ];
      }, acc)
      .map((point, index, otherPoints) => {
        if (isMissing(point)) {
          const nextValue = otherPoints.find((p, i) => i > index && p.value);

          if (nextValue) {
            return {
              ...point,
              value: nextValue.value,
            };
          }

          const previousValue = [...otherPoints].reverse()
            .find((p, i) => i > otherPoints.length - index && p.value);

          if (previousValue) {
            return {
              ...point,
              value: previousValue.value,
            };
          }

          return {
            ...point,
            value: 0,
          };
        }

        return point;
      });
  }, []);
}
