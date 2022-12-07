import { ProfilePoint } from '../types';

function bridgeLine(
  xScaleProfile: (x: number) => number,
  yScaleProfile: (msl: number) => number,
  firstPoint: ProfilePoint,
  lastPoint: ProfilePoint,
  bridgeLevel: number | undefined,
  bridgeHeight: number,
): [[number, number][], [number, number][]] {
  if (typeof bridgeLevel === 'undefined') {
    return [[], []];
  }

  const totalWidth = lastPoint.x - firstPoint.x;
  const triangleWidth = bridgeHeight * 2;
  const triangles = Math.floor(totalWidth / triangleWidth);
  const triangleWidthFitted = totalWidth / triangles;

  const tw = triangleWidthFitted / 2;

  const points: [number, number][] = [
    [
      xScaleProfile(firstPoint.x),
      yScaleProfile(firstPoint.y),
    ],
    [
      xScaleProfile(firstPoint.x + tw),
      yScaleProfile(firstPoint.y + bridgeHeight),
    ],
    [
      xScaleProfile(lastPoint.x - tw),
      yScaleProfile(lastPoint.y + bridgeHeight),
    ],
    [
      xScaleProfile(lastPoint.x),
      yScaleProfile(lastPoint.y),
    ],
  ];

  const supports: [number, number][] = [
    [
      xScaleProfile(firstPoint.x + tw),
      yScaleProfile(bridgeLevel + bridgeHeight),
    ],
  ];

  for (let i = 0; i < triangles; i += 1) {
    const x = firstPoint.x + (i * triangleWidthFitted);
    supports.push([xScaleProfile(x), yScaleProfile(bridgeLevel)]);
    supports.push([xScaleProfile(x + tw), yScaleProfile(bridgeLevel + bridgeHeight)]);
  }

  return [points, supports];
}

export default bridgeLine;
