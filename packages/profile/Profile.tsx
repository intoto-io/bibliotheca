import { FunctionComponent, useMemo } from 'react';
import { line, curveBasis } from 'd3-shape';

import { RiverProfile } from './types';

export interface ProfileProps {
  profile: RiverProfile;
}

const Profile: FunctionComponent<ProfileProps> = ({ profile }) => {
  const maxMSL = Math.max(...profile.map((p) => p.msl));
  const minMSL = Math.min(...profile.map((p) => p.msl));
  const width = Math.max(...profile.map((p) => p.x));
  const height = maxMSL - minMSL;

  const padding = 10;
  const renderWidth = 600;
  const renderWidthWithoutPadding = renderWidth - (padding * 2);
  const renderHeight = ((height / width) * renderWidth) + (padding * 2);
  const ratio = renderWidthWithoutPadding / width;

  const points = useMemo(() => profile
    .map((p): [number, number] => {
      const { msl } = p;
      const x = padding + (p.x * ratio);
      const y = padding + ((height - (msl - minMSL)) * ratio);

      return [x, y];
    }), [height, minMSL, profile, ratio]);

  const closePoints: [number, number][] = [
    // right top
    [points[points.length - 1][0], points[points.length - 1][1]],
    // right bottom
    [points[points.length - 1][0], (renderHeight - (padding / 2))],
    // left bottom
    [points[0][0], (renderHeight - (padding / 2))],
    // left top
    [points[0][0], points[0][1]],
  ];

  const path = line<[number, number]>(([x]) => x, ([_, y]) => y)
    .curve(curveBasis)(points);

  const closePath = line<[number, number]>(([x]) => x, ([_, y]) => y)(closePoints);

  return (
    <svg
      width={renderWidth}
      height={renderHeight}
      viewBox={`0 0 ${renderWidth} ${renderHeight}`}
    >
      <path
        d={path || ''}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <path
        d={closePath || ''}
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );
};

export default Profile;
