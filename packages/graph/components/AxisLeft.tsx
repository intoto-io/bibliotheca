import { FunctionComponent } from 'react';
import { ScaleLinear } from 'd3-scale';

import { AxisLeft as AxisLeftVisX } from '@visx/axis';

import tickFormat from '../helpers/tickFormat';

interface AxisLeftProps {
  plot: GraphSeries;
  height: number;
  yScale: ScaleLinear<number, number>;
  defaultLabelWidth: number;
}

const AxisLeft: FunctionComponent<AxisLeftProps> = ({
  plot,
  height,
  yScale,
  defaultLabelWidth,
}) => {
  const tickHeight = 30;

  return (
    <svg width={plot.labelWidth || defaultLabelWidth} height={height}>
      <AxisLeftVisX
        scale={yScale}
        left={plot.labelWidth || defaultLabelWidth}
        tickFormat={(tick) => tickFormat(plot, tick.valueOf())}
        numTicks={Math.floor(height / tickHeight)}
      />
    </svg>
  );
};

export default AxisLeft;