import { FunctionComponent } from "react";
import { ScaleLinear, ScaleTime } from "d3-scale";

import { RectClipPath } from "@visx/clip-path";

import colorByIndex from "../helpers/colorByIndex";
import { separateSeriesDataOnMissingAndPredicted } from "../helpers/separateSeriesData";
import hasValueInThreshold from "../helpers/hasValueInThreshold";
import { GraphSeries } from "../types";

import SplitLine from "./SplitLine";

interface LineProps {
  keyRef: string;
  plot: GraphSeries;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  index?: number;
  navigation?: boolean;
}

const Line: FunctionComponent<LineProps> = function Line({
  keyRef,
  plot,
  xScale,
  yScale,
  index = 0,
  navigation = false,
}) {
  const seriesData = separateSeriesDataOnMissingAndPredicted(plot.data);

  const color = plot.color || colorByIndex(index);

  const hasThresholdData = hasValueInThreshold(plot.data, plot.threshold, plot.thresholdDirection);
  const cutOff = yScale(plot.threshold || 0);
  const padding = 1;

  const splitLineProps = {
    seriesData,
    xScale,
    yScale,
    curve: plot.curve,
  };

  return (
    <>
      {typeof plot.threshold !== "undefined" && hasThresholdData && (
        <g clipPath={`url(#${plot.key}_threshold_clip)`}>
          <RectClipPath
            id={`${plot.key}_threshold_clip`}
            width="100%"
            height={plot.thresholdDirection === "up" ? cutOff - padding : "100%"}
            y={plot.thresholdDirection === "up" ? 0 : cutOff - padding}
          />
          <SplitLine
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...splitLineProps}
            key={`${keyRef}_threshold`}
            keyRef={`${keyRef}_threshold`}
            color={plot.thresholdColor || "#000"}
            area={plot.area}
          />
        </g>
      )}
      <g
        clipPath={
          (typeof plot.threshold !== "undefined" && hasThresholdData) || navigation
            ? `url(#${plot.key}_main_clip)`
            : undefined
        }
      >
        <RectClipPath
          id={`${plot.key}_main_clip`}
          width="100%"
          height={plot.thresholdDirection === "up" ? "100%" : cutOff + padding}
          y={plot.thresholdDirection === "up" ? cutOff + padding : 0}
        />
        <SplitLine
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...splitLineProps}
          key={`${keyRef}_main`}
          keyRef={`${keyRef}_main`}
          color={color}
          area={plot.area}
        />
      </g>
    </>
  );
};

export default Line;
