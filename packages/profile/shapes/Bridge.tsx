import { line } from 'd3-shape';

import bridgeLine from '../helpers/bridgeLine';

import { BridgeShape } from '../types';

interface BridgeProps {
  shape: BridgeShape;
  xScale(x: number): number;
  yScale(y: number): number;
}

function Bridge({ shape, xScale, yScale }: BridgeProps) {
  const {
    bridgeStrokeWidth = 2,
    bridgeStrokeColor = '#000',
    bridgeBottomColor = '#bbb',
    points,
  } = shape;

  const [bridgePath, bridgeSupportPath] = bridgeLine(
    xScale,
    yScale,
    points[1],
    points[2],
    points[1].y,
    shape.bridgeHeight,
  );

  const bridgePathLine = line()(bridgePath);
  const bridgeSupportPathLine = line()(bridgeSupportPath);

  return (
    <g>
      <polygon
        id="bridge-bottom"
        points={[
          ...points.map((p) => `${xScale(p.x)},${yScale(p.y)}`),
          ...points.slice(0).reverse()
            .map((p) => `${xScale(p.x)},${yScale(p.y - shape.bridgeBottom)}`),
        ].join(' ')}
        fill={bridgeBottomColor}
        opacity={1}
        vectorEffect="non-scaling-stroke"
      />
      <path
        id="bridge-way"
        d={points.map((p, i) => {
          const letter = i === 0 ? 'M' : 'L';

          return `${letter}${xScale(p.x)},${yScale(p.y)}`;
        }).join(' ')}
        stroke={bridgeStrokeColor}
        strokeWidth={bridgeStrokeWidth}
        strokeOpacity={1}
        fill="transparent"
        vectorEffect="non-scaling-stroke"
      />
      <path
        id="bridge-support"
        d={[bridgeSupportPathLine].join(' ')}
        stroke={bridgeStrokeColor}
        strokeWidth={bridgeStrokeWidth}
        strokeOpacity={1}
        fill="transparent"
        vectorEffect="non-scaling-stroke"
      />
      <path
        id="bridge"
        d={[bridgePathLine].join(' ')}
        stroke={bridgeStrokeColor}
        strokeWidth={bridgeStrokeWidth}
        fill="transparent"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

export default Bridge;
