import { FunctionComponent, useCallback, useMemo } from 'react';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { CurveFactory } from 'd3-shape';

import { LinePath } from '@visx/shape';
import { curveNatural } from '@visx/curve';
import { Threshold } from '@visx/threshold';
import { ClipPath } from '@visx/clip-path';

import { isMissing, isPredicted } from '../helpers/dataPoint';

interface SplitLineProps {
  keyRef: string;
  seriesData: DataPoint[][];
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  color: string;
  curve?: CurveFactory;
}

const SplitLine: FunctionComponent<SplitLineProps> = ({
  keyRef,
  color,
  seriesData,
  xScale,
  yScale,
  curve = curveNatural,
}) => {
  const flatData = useMemo(
    () => seriesData
      .reduce((acc: DataPoint[], plot: DataPoint[]): DataPoint[] => [...acc, ...plot], []),
    [seriesData],
  );
  const hasPredictedData = useMemo(() => flatData.some(isPredicted), [flatData]);
  const areaProps = {
    fill: color,
    fillOpacity: 0.15,
  };

  const hasMissingData = flatData.some(isMissing);

  const clipPathRect = useCallback((
    plot: DataPoint[],
    index: number,
    otherPlots: DataPoint[][],
    missing = true,
  ) => {
    if (plot.some((p) => isMissing(p) === missing)) {
      const from = xScale(plot[plot.length - 1].date);
      const to = xScale(
        otherPlots[index - 1]
          ? otherPlots[index - 1][otherPlots[index - 1].length - 1].date
          : plot[0].date,
      );

      return (
        <rect
          key={`${keyRef}_missing_rect_${from}`}
          y={0}
          x={from}
          width={to - from}
          height="100%"
        />
      );
    }

    return null;
  }, [keyRef, xScale]);

  return (
    <>
      {hasPredictedData && (
        <Threshold
          id={keyRef}
          data={flatData}
          x={(datum) => xScale(datum.date)}
          y0={(datum) => (isPredicted(datum) ? yScale(datum.minValue) : yScale(datum.value))}
          y1={(datum) => (isPredicted(datum) ? yScale(datum.maxValue) : yScale(datum.value))}
          curve={curve}
          clipAboveTo={0}
          clipBelowTo={3000}
          belowAreaProps={areaProps}
          aboveAreaProps={areaProps}
        />
      )}
      {hasMissingData && (
        <g clipPath={`url(#${keyRef}_missing_data)`}>
          <ClipPath id={`${keyRef}_missing_data`}>
            {seriesData.map((plot, index, otherPlots) => clipPathRect(plot, index, otherPlots))}
          </ClipPath>
          <LinePath
            curve={curve}
            data={flatData}
            x={(datum) => xScale(datum.date)}
            y={(datum) => yScale(datum.value)}
            stroke={color}
            strokeWidth={1.8}
            strokeDasharray="2, 4"
            strokeOpacity={1}
          />
        </g>
      )}
      <g clipPath={`url(#${keyRef}_data)`}>
        <ClipPath id={`${keyRef}_data`}>
          {seriesData
            .map((plot, index, otherPlots) => clipPathRect(plot, index, otherPlots, false))}
        </ClipPath>
        <LinePath
          curve={curve}
          data={flatData}
          x={(datum) => xScale(datum.date)}
          y={(datum) => yScale(datum.value)}
          stroke={color}
          strokeWidth={1.8}
          strokeOpacity={1}
        />
      </g>
    </>
  );
};

export default SplitLine;