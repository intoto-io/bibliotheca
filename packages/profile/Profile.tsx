import { FunctionComponent, useCallback, useMemo } from 'react';
import { line, curveBasis, curveLinearClosed } from 'd3-shape';

import { ProfilePoint, RiverProfile } from './types';

export interface ProfileProps {
  profile: RiverProfile;
  bridgeLevel?: number;
  currentWaterLevel?: number;
  strokeWidth?: number;
  strokeColor?: string;
  groundFill?: string;
  waterFill?: string;
}

const baseLine = line<[number, number]>(([x]) => x, ([_, y]) => y);
const baseLineClosed = line<[number, number]>(([x]) => x, ([_, y]) => y).curve(curveLinearClosed);
const bankLine = line<[number, number]>(([x]) => x, ([_, y]) => y).curve(curveBasis);

const findHightestPoint = (items: RiverProfile): ProfilePoint => items.reduce((a, b) => {
  if (b.msl > a.msl) {
    return b;
  }

  return a;
});

const Profile: FunctionComponent<ProfileProps> = ({
  profile,
  currentWaterLevel,
  bridgeLevel,
  strokeColor = 'black',
  strokeWidth = 1.5,
  groundFill = '#b4967d',
  waterFill = '#99ccff',
}) => {
  const bridgeSize = 0.5;

  const maxMSLRiver = Math.max(...profile.map((p) => p.msl));
  const maxMSL = typeof bridgeLevel !== 'undefined'
    ? Math.max(maxMSLRiver, bridgeLevel + bridgeSize)
    : maxMSLRiver;
  const minMSL = Math.min(...profile.map((p) => p.msl));

  const maxWaterXL = useMemo(() => {
    const highest = findHightestPoint(profile
      .slice(0, Math.round(profile.length / 2)));
    return highest.x;
  }, [profile]);

  const maxWaterXR = useMemo(() => {
    const highest = findHightestPoint(profile
      .slice(Math.round(profile.length / 2) * -1));
    return highest.x;
  }, [profile]);

  const width = Math.max(...profile.map((p) => p.x));
  const height = maxMSL - minMSL;

  const padding = 5;
  const bankPadding = 15;

  const totalWidth = 600;
  const renderWidth = totalWidth - (padding * 2);
  const renderHeight = ((height / width) * renderWidth);
  const totalHeight = renderHeight + bankPadding + (padding * 2);

  const ratio = renderWidth / width;

  const xToX = useCallback(
    (x: number) => padding + (x * ratio),
    [ratio],
  );
  const mslToY = useCallback(
    (msl: number) => padding + ((height - (msl - minMSL)) * ratio),
    [height, minMSL, ratio],
  );

  const points = useMemo(() => profile
    .map((p): [number, number] => {
      const { msl } = p;
      const x = xToX(p.x);
      const y = mslToY(msl);

      return [x, y];
    }), [mslToY, profile, xToX]);

  const closePoints: [number, number][] = useMemo(() => [
    // right top
    [points[points.length - 1][0], points[points.length - 1][1]],
    // right bottom
    [points[points.length - 1][0], renderHeight + padding + bankPadding],
    // left bottom
    [points[0][0], renderHeight + padding + bankPadding],
    // left top
    [points[0][0], points[0][1]],
  ], [points, renderHeight]);

  const path = bankLine(points);
  const closePath = baseLine(closePoints);
  const waterLevelPath = baseLineClosed(
    typeof currentWaterLevel !== 'undefined'
      ? [
        [xToX(maxWaterXL), mslToY(currentWaterLevel)],
        [xToX(maxWaterXR), mslToY(currentWaterLevel)],
        [xToX(maxWaterXR), mslToY(minMSL)],
        [xToX(maxWaterXL), mslToY(minMSL)],
      ]
      : [],
  );
  const bridgePath = baseLineClosed(
    typeof bridgeLevel !== 'undefined'
      ? [
        // bottom left bridge
        [points[0][0], mslToY(bridgeLevel)],
        // bottom right bridge
        [points[points.length - 1][0], mslToY(bridgeLevel)],
        // start top deck
        [points[points.length - 1][0], mslToY(bridgeLevel + bridgeSize)],
        // end top deck
        [points[0][0], mslToY(bridgeLevel + bridgeSize)],
      ]
      : [],
  );

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
    >
      <defs>
        <linearGradient id="waterFill" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor={waterFill} stopOpacity={0.6} offset="0%" />
          <stop stopColor={waterFill} stopOpacity={1} offset="38%" />
        </linearGradient>
        <linearGradient id="bridgeFill" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#000" stopOpacity={0.6} offset="0%" />
          <stop stopColor="#000" stopOpacity={0.7} offset="20%" />
        </linearGradient>
      </defs>
      {typeof bridgeLevel !== 'undefined' && (
        <path
          d={[bridgePath].join(' ')}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="url(#bridgeFill)"
        />
      )}
      {typeof currentWaterLevel !== 'undefined' && (
        <path
          d={[waterLevelPath].join(' ')}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="url(#waterFill)"
        />
      )}
      <path
        d={[path, closePath].join(' ')}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={groundFill}
      />
    </svg>
  );
};

export default Profile;
