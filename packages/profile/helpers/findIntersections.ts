import { ProfilePoint } from '../types';

function calculateIntersection(
  p1: ProfilePoint,
  p2: ProfilePoint,
  p3: ProfilePoint,
  p4: ProfilePoint,
): ProfilePoint {
  // down part of intersection point formula
  const d1 = (p1.x - p2.x) * (p3.msl - p4.msl); // (x1 - x2) * (y3 - y4)
  const d2 = (p1.msl - p2.msl) * (p3.x - p4.x); // (y1 - y2) * (x3 - x4)
  const d = (d1) - (d2);

  if (d === 0) {
    throw new Error('Number of intersection points is zero or infinity.');
  }

  // upper part of intersection point formula
  const u1 = (p1.x * p2.msl - p1.msl * p2.x); // (x1 * y2 - y1 * x2)
  const u4 = (p3.x * p4.msl - p3.msl * p4.x); // (x3 * y4 - y3 * x4)

  const u2x = p3.x - p4.x; // (x3 - x4)
  const u3x = p1.x - p2.x; // (x1 - x2)
  const u2y = p3.msl - p4.msl; // (y3 - y4)
  const u3y = p1.msl - p2.msl; // (y1 - y2)

  // intersection point formula
  const px = (u1 * u2x - u3x * u4) / d;
  const py = (u1 * u2y - u3y * u4) / d;

  return { x: px, msl: py };
}

function findIntersections(
  profile: ProfilePoint[],
  msl?: number,
): [ProfilePoint, ProfilePoint] | undefined {
  if (typeof msl === 'undefined') {
    return undefined;
  }

  const leftProfile = profile.slice(0, Math.round(profile.length / 2));
  const rightProfile = profile.slice(Math.round(profile.length / 2) * -1);

  const leftIndex = leftProfile.findIndex(
    (item, index, allItems) => allItems[index + 1]
      && item.msl > msl && allItems[index + 1].msl < msl,
  );
  const rightIndex = rightProfile.findIndex(
    (item, index, allItems) => allItems[index + 1]
      && item.msl < msl && allItems[index + 1].msl > msl,
  );

  if (leftIndex === -1 || rightIndex === -1) {
    return undefined;
  }

  const waterLine = [{ x: 0, msl }, { x: profile[profile.length - 1].x, msl }];

  return [
    calculateIntersection(
      leftProfile[leftIndex],
      leftProfile[leftIndex + 1],
      waterLine[0],
      waterLine[1],
    ),
    calculateIntersection(
      rightProfile[rightIndex],
      rightProfile[rightIndex + 1],
      waterLine[0],
      waterLine[1],
    ),
  ];
}

export default findIntersections;
