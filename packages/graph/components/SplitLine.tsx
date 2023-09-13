import { FunctionComponent, useCallback, useMemo } from 'react';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { CurveFactory } from 'd3-shape';

import { Area, LinePath } from '@visx/shape';
import { curveNatural } from '@visx/curve';
import { Threshold } from '@visx/threshold';
import { ClipPath } from '@visx/clip-path';
import { LinearGradient } from '@visx/gradient';

import { isMissing, isPredicted } from '../helpers/dataPoint';
import { DataPoint } from '../types';

interface SplitLineProps {
  keyRef: string;
  seriesData: DataPoint[][];
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  color: string;
  curve?: CurveFactory;
  area?: boolean;
  strokeWidth?: number;
}

const SplitLine: FunctionComponent<SplitLineProps> = function SplitLine({
  keyRef,
  color,
  seriesData,
  xScale,
  yScale,
  curve = curveNatural,
  area = false,
  strokeWidth = 1.8,
}) {
  const flatData = useMemo(
    () => seriesData.reduce((acc: DataPoint[], plot: DataPoint[]): DataPoint[] => [...acc, ...plot], []),
    [seriesData],
  );
  const hasPredictedData = useMemo(() => flatData.some((p) => isPredicted(p)), [flatData]);
  const areaProps = {
    fill: color,
    fillOpacity: 0.075,
  };

  const hasMissingData = flatData.some(isMissing);

  const clipPathRect = useCallback(
    (plot: DataPoint[], index: number, otherPlots: DataPoint[][], missing = true, predicted = false) => {
      if (plot.some((p) => isMissing(p) === missing && isPredicted(p) === predicted)) {
        const nextPlot = otherPlots[index + 1];
        const prevPlot = otherPlots[index - 1];

        let from = xScale(new Date(plot[plot.length - 1].date));
        let to = xScale(
          prevPlot && !prevPlot.some((p) => isPredicted(p))
            ? new Date(prevPlot[prevPlot.length - 1].date)
            : new Date(plot[0].date),
        );
        let name = `${keyRef}_main_rect_${from}`;

        if (plot.some((p) => isPredicted(p))) {
          from = xScale(new Date(nextPlot[0].date));
          to = xScale(prevPlot ? new Date(prevPlot[prevPlot.length - 1].date) : new Date(plot[0].date));
          name = `${keyRef}_predicted_rect_${from}`;
        } else if (plot.some((p) => isMissing(p))) {
          from = xScale(new Date(plot[plot.length - 1].date));
          to = xScale(
            otherPlots[index - 1]
              ? new Date(otherPlots[index - 1][otherPlots[index - 1].length - 1].date)
              : new Date(plot[0].date),
          );
          name = `${keyRef}_missing_rect_${from}`;
        }

        return <rect key={name} y={0} x={from} width={to - from} height="100%" />;
      }

      return null;
    },
    [keyRef, xScale],
  );

  return (
    <>
      {hasPredictedData && (
        <g clipPath={`url(#${keyRef}_predicted_data)`}>
          <ClipPath id={`${keyRef}_predicted_data`}>
            {seriesData.map((plot, index, otherPlots) => clipPathRect(plot, index, otherPlots, false, true))}
          </ClipPath>
          <Threshold
            id={keyRef}
            data={flatData}
            x={(datum) => xScale(new Date(datum.date))}
            y0={(datum) =>
              isPredicted(datum) && typeof datum.minValue !== 'undefined' ? yScale(datum.minValue) : yScale(datum.value)
            }
            y1={(datum) =>
              isPredicted(datum) && typeof datum.maxValue !== 'undefined' ? yScale(datum.maxValue) : yScale(datum.value)
            }
            curve={curve}
            clipAboveTo={0}
            clipBelowTo={3000}
            belowAreaProps={areaProps}
            aboveAreaProps={areaProps}
          />
          <LinePath
            curve={curve}
            data={flatData}
            x={(datum) => xScale(new Date(datum.date))}
            y={(datum) => yScale(datum.value)}
            stroke={color}
            strokeWidth={strokeWidth * (2 / 3)}
            strokeOpacity={0.75}
          />
        </g>
      )}
      {hasMissingData && (
        <g clipPath={`url(#${keyRef}_missing_data)`}>
          <ClipPath id={`${keyRef}_missing_data`}>
            {seriesData.map((plot, index, otherPlots) => clipPathRect(plot, index, otherPlots, true, false))}
          </ClipPath>
          {area && (
            <>
              <LinearGradient
                id={`${keyRef}_missing_area_gradient`}
                from={color}
                to={color}
                fromOpacity={0.5}
                toOpacity={0}
              />
              <Area
                curve={curve}
                data={flatData}
                x={(datum) => xScale(new Date(datum.date))}
                y0={(datum) => yScale(datum.value)}
                y1={() => yScale(Math.min(...yScale.domain()))}
                fill={`url(#${keyRef}_missing_area_gradient)`}
              />
            </>
          )}
          <LinePath
            curve={curve}
            data={flatData}
            x={(datum) => xScale(new Date(datum.date))}
            y={(datum) => yScale(datum.value)}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="3, 9"
            strokeOpacity={1}
          />
        </g>
      )}
      <g clipPath={`url(#${keyRef}_data)`}>
        <ClipPath id={`${keyRef}_data`}>
          {seriesData.map((plot, index, otherPlots) => clipPathRect(plot, index, otherPlots, false, false))}
        </ClipPath>
        {area && (
          <>
            <LinearGradient id={`${keyRef}_area_gradient`} from={color} to={color} fromOpacity={0.75} toOpacity={0.1} />
            <Area
              curve={curve}
              data={flatData}
              x={(datum) => xScale(new Date(datum.date))}
              y0={(datum) => yScale(datum.value)}
              y1={() => yScale(Math.min(...yScale.domain()))}
              fill={`url(#${keyRef}_area_gradient)`}
            />
          </>
        )}
        <LinePath
          curve={curve}
          data={flatData}
          x={(datum) => xScale(new Date(datum.date))}
          y={(datum) => yScale(datum.value)}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={1}
        />
      </g>
    </>
  );
};

export default SplitLine;
