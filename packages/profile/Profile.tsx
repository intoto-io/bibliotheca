import {
  FunctionComponent, useEffect, useMemo, useRef,
} from 'react';
import { line, curveBasis, curveLinearClosed } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { axisLeft } from 'd3-axis';
import { select } from 'd3-selection';

import { ProfilePoint, RiverProfile } from './types';

export interface ProfileProps {
  profile: RiverProfile;
  axis?: boolean;
  width?: number;
  bridgeLevel?: number;
  currentWaterLevel?: number;
  strokeWidth?: number;
  strokeColor?: string;
  groundFill?: string;
  waterFill?: string;
}

const baseLine = line();
const closedLine = line().curve(curveLinearClosed);

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
  width = 600,
  axis = false,
  strokeColor = 'black',
  strokeWidth = 1.5,
  groundFill = '#b4967d',
  waterFill = '#99ccff',
}) => {
  const axisLeftRef = useRef<SVGGElement>(null);

  const bridgeSize = 0.5;

  const maxMSLRiver = Math.max(...profile.map((p) => p.msl));
  const maxMSL = typeof bridgeLevel !== 'undefined'
    ? Math.max(maxMSLRiver, bridgeLevel + bridgeSize)
    : maxMSLRiver;
  const minMSL = Math.min(...profile.map((p) => p.msl));

  const maxWaterXL = useMemo(() => findHightestPoint(profile
    .slice(0, Math.round(profile.length / 2))), [profile]);

  const maxWaterXR = useMemo(() => findHightestPoint(profile
    .slice(Math.round(profile.length / 2) * -1)), [profile]);

  const riverWidth = Math.max(...profile.map((p) => p.x));
  const riverAndBridgeHeight = maxMSL - minMSL;

  const padding = 5;
  const offsetLeft = axis ? 55 : 0;
  const bankPadding = 15;

  const totalWidth = width;
  const renderWidth = totalWidth - (padding * 2) - offsetLeft;
  const renderHeight = ((riverAndBridgeHeight / riverWidth) * renderWidth);
  const totalHeight = renderHeight + bankPadding + (padding * 2);

  const xScale = scaleLinear()
    .domain([0, riverWidth])
    .range([0, renderWidth]);

  const yScale = useMemo(() => scaleLinear()
    .domain([minMSL, maxMSL])
    .range([renderHeight, 0]), [maxMSL, minMSL, renderHeight]);

  useEffect(() => {
    if (axisLeftRef.current !== null) {
      const leftAxis = axisLeft(yScale);

      select(axisLeftRef.current)
        .call(leftAxis);
    }
  }, [yScale]);

  const xScaleProfile = (x: number): number => xScale(x) + padding + offsetLeft;
  const yScaleProfile = (msl: number): number => yScale(msl) + padding;
  const profilePointX = (d: ProfilePoint): number => xScaleProfile(d.x);
  const profilePointY = (d: ProfilePoint): number => yScaleProfile(d.msl);

  const bankLine = line<ProfilePoint>().x(profilePointX).y(profilePointY).curve(curveBasis);

  const firstPoint = profile[0];
  const lastPoint = profile[profile.length - 1];

  const path = bankLine(profile);
  const closePath = baseLine([
    // right top
    [profilePointX(lastPoint), profilePointY(lastPoint)],
    // bottom right
    [profilePointX(lastPoint), yScaleProfile(minMSL) + bankPadding],
    // bottom left
    [profilePointX(firstPoint), yScaleProfile(minMSL) + bankPadding],
    // top left
    [profilePointX(firstPoint), profilePointY(firstPoint)],
  ]);

  const waterLeft = typeof currentWaterLevel !== 'undefined' && currentWaterLevel > maxWaterXL.msl
    ? xScaleProfile(profile[0].x) : xScaleProfile(maxWaterXL.x);
  const waterRight = typeof currentWaterLevel !== 'undefined' && currentWaterLevel > maxWaterXR.msl
    ? xScaleProfile(profile[profile.length - 1].x) : xScaleProfile(maxWaterXR.x);

  const waterLevelPath = closedLine(
    typeof currentWaterLevel !== 'undefined'
      ? [
        [waterLeft, yScaleProfile(currentWaterLevel)],
        [waterRight, yScaleProfile(currentWaterLevel)],
        [waterRight, yScaleProfile(minMSL)],
        [waterLeft, yScaleProfile(minMSL)],
      ]
      : [],
  );

  const bridgePath = closedLine(
    typeof bridgeLevel !== 'undefined'
      ? [
        // bottom left bridge
        [profilePointX(firstPoint), yScaleProfile(bridgeLevel)],
        // bottom right bridge
        [profilePointX(lastPoint), yScaleProfile(bridgeLevel)],
        // start top deck
        [profilePointX(lastPoint), yScaleProfile(bridgeLevel + bridgeSize)],
        // end top deck
        [profilePointX(firstPoint), yScaleProfile(bridgeLevel + bridgeSize)],
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
      {axis && (
        <>
          <g
            ref={axisLeftRef}
            transform={`translate(${offsetLeft - 3}, ${padding})`}
          />
          <text
            style={{ textAnchor: 'middle', transform: 'rotate(-90deg)', fontSize: '12px' }}
            y={10 + padding}
            x={(yScale(minMSL) / 2) * -1}
          >
            MSL
          </text>
        </>
      )}
    </svg>
  );
};

export default Profile;
