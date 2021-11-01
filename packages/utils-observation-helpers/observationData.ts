import { setHours, getHours } from 'date-fns';
import { isMissing, DataPoint } from '@intoto-dev/bibliotheca-graph';

import { ObservationRecord } from './types';

export function observationDataToLineData(
  data: ObservationRecord[],
  now = new Date(),
): DataPoint[] {
  return data.reduce((acc: DataPoint[], day) => {
    const {
      date,
      values,
      min,
      max,
    } = day;

    const startOffset = getHours(date);

    return values
      .reduceRight((points, value, index) => {
        const hours = (index * (24 / values.length)) + startOffset;
        const newDate = setHours(date, hours);

        if (value === null && now < newDate) {
          return points;
        }

        const baseValue = {
          date: newDate,
          value: value || 0,
        };

        if (
          (min && typeof min[index] !== 'undefined' && min[index] !== null)
          || (max && typeof max[index] !== 'undefined' && max[index] !== null)
        ) {
          return [
            ...points,
            {
              ...baseValue,
              predicted: true,
              minValue: min && typeof min[index] !== 'undefined' && min[index] !== null
                ? min[index] : undefined,
              maxValue: max && typeof max[index] !== 'undefined' && max[index] !== null
                ? max[index] : undefined,
            },
          ];
        }

        return [
          ...points,
          {
            ...baseValue,
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
