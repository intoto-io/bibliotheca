import { FunctionComponent, useMemo } from 'react';
import { line, curveBasis } from 'd3-shape';

import { RiverProfile } from './types';

export interface ProfileProps {
  profile: RiverProfile;
  strokeWidth?: number;
  strokeColor?: string;
  groundFill?: string;
}

const baseLine = line<[number, number]>(([x]) => x, ([_, y]) => y);
const bankLine = line<[number, number]>(([x]) => x, ([_, y]) => y).curve(curveBasis);

const Profile: FunctionComponent<ProfileProps> = ({
  profile,
  strokeColor = 'black',
  strokeWidth = 1.5,
  groundFill = '#937960',
}) => {
  const maxMSL = Math.max(...profile.map((p) => p.msl));
  const minMSL = Math.min(...profile.map((p) => p.msl));
  const width = Math.max(...profile.map((p) => p.x));
  const height = maxMSL - minMSL;

  const padding = 5;
  const bankPadding = 15;

  const totalWidth = 600;
  const renderWidth = totalWidth - (padding * 2);
  const renderHeight = ((height / width) * renderWidth);
  const totalHeight = renderHeight + bankPadding + (padding * 2);

  const ratio = renderWidth / width;

  const points = useMemo(() => profile
    .map((p): [number, number] => {
      const { msl } = p;
      const x = padding + (p.x * ratio);
      const y = padding + ((height - (msl - minMSL)) * ratio);

      return [x, y];
    }), [height, minMSL, profile, ratio]);

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

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
    >
      <path
        d={[path, closePath].join(' ') || ''}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={groundFill}
      />
    </svg>
  );
};

export default Profile;
