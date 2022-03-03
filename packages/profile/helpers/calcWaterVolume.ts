import { ProfilePoint } from '../types';

function calcWaterVolume(
  profile: ProfilePoint[],
  intersections?: [ProfilePoint, ProfilePoint],
): number {
  if (intersections) {
    const points = profile
      .filter((p) => p.x >= intersections[0].x
        && p.x <= intersections[1].x
        && p.msl <= intersections[0].msl);

    const waterProfile = [intersections[0], ...points, intersections[1]];

    return waterProfile
      .reduce((acc, p1, index, rest): number => {
        const p2 = rest[index < rest.length - 1 ? index + 1 : 0];

        return acc + (p1.x * p2.msl - p1.msl * p2.x);
      }, 0) / 2;
  }

  return 0;
}

export default calcWaterVolume;
