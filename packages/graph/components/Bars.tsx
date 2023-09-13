import { FunctionComponent, Fragment } from 'react';
import { compareAsc } from 'date-fns';
import { ScaleLinear, ScaleTime } from 'd3-scale';

import { Bar, Line as LineVisx } from '@visx/shape';
import { Group } from '@visx/group';

import { isMissing, isPredicted } from '../helpers/dataPoint';
import colorByIndex from '../helpers/colorByIndex';
import colorByThreshold from '../helpers/colorByThreshold';
import { GraphSeries } from '../types';

interface BarProps {
  plot: GraphSeries;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  lastDate: Date;
  index?: number;
  height?: number;
  barWidth?: number;
  barPadding?: number;
}

const Bars: FunctionComponent<BarProps> = function Bars({
  plot,
  xScale,
  yScale,
  lastDate,
  index = 0,
  height = 200,
  barWidth = 14,
  barPadding = 0,
}) {
  return (
    <Group>
      {plot.data.map((datum, i) => {
        // skip last date entry
        if (compareAsc(new Date(datum.date), lastDate) === 0) return null;

        const barHeight = height - yScale(datum.value);
        const barX = xScale(new Date(datum.date));
        const barY = height - barHeight;

        const color = colorByThreshold(
          datum.value,
          plot.threshold,
          plot.thresholdColor,
          plot.thresholdDirection,
          plot.color || colorByIndex(index),
        );

        const x = barX + (barPadding ? barPadding / 2 : 0) - barWidth / 2;
        const predictionWidth = 3;
        const predictionX = x + barWidth / 2 - predictionWidth / 2;

        const barOpacity = (): number => {
          if (isMissing(datum)) {
            return 0.3;
          }

          if (isPredicted(datum)) {
            return 0.6;
          }

          if (typeof plot.barOpacity !== 'undefined') {
            return plot.barOpacity;
          }

          return 1;
        };

        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={`${plot.key}_${i}`}>
            <Bar
              x={x}
              y={barY}
              width={barWidth - barPadding}
              height={barHeight}
              fill={color}
              fillOpacity={barOpacity()}
            />
            {isPredicted(datum) && (
              <>
                <LineVisx
                  from={{ x: predictionX - barWidth / 2, y: yScale(datum.maxValue) }}
                  to={{ x: predictionX + barWidth / 2, y: yScale(datum.maxValue) }}
                  stroke="#000"
                  strokeWidth={predictionWidth}
                  strokeOpacity={1}
                  pointerEvents="none"
                />
                <LineVisx
                  from={{ x: predictionX, y: yScale(datum.minValue) }}
                  to={{ x: predictionX, y: yScale(datum.maxValue) }}
                  stroke="#000"
                  strokeWidth={predictionWidth}
                  strokeOpacity={1}
                  pointerEvents="none"
                />
                <LineVisx
                  from={{ x: predictionX - barWidth / 2, y: yScale(datum.minValue) }}
                  to={{ x: predictionX + barWidth / 2, y: yScale(datum.minValue) }}
                  stroke="#000"
                  strokeWidth={predictionWidth}
                  strokeOpacity={1}
                  pointerEvents="none"
                />
              </>
            )}
          </Fragment>
        );
      })}
    </Group>
  );
};

export default Bars;
