import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  line,
  area,
  curveBasis,
  curveLinearClosed,
} from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisTop, axisRight } from 'd3-axis';
import { select } from 'd3-selection';

import findIntersections from './helpers/findIntersections';

import { ProfilePoint, RiverProfile } from './types';

export interface ProfileProps {
  profile: RiverProfile;
  axis?: boolean;
  bridgeLevel?: number;
  currentWaterLevel?: number;
  groundFill?: string;
  strokeColor?: string;
  strokeWidth?: number;
  waterStrokeColor?: string;
  waterFill?: string;
  width?: number;
}

const closedLine = line().curve(curveLinearClosed);

const findHighestPoint = (items: RiverProfile): ProfilePoint => items.reduce((a, b) => {
  if (b.msl > a.msl) {
    return b;
  }

  return a;
}, { x: 0, msl: 0 });

const Profile: FunctionComponent<ProfileProps> = function Profile({
  profile,
  currentWaterLevel,
  bridgeLevel,
  width = 600,
  axis = false,
  strokeColor = 'black',
  strokeWidth = 1.5,
  waterStrokeColor = '#0633ff',
  waterFill = '#b6c0ff',
  groundFill = '#b4967d',
}) {
  const axisRightRef = useRef<SVGGElement>(null);
  const axisBottomRef = useRef<SVGGElement>(null);
  const rulerWaterRef = useRef<SVGGElement>(null);

  const bridgeSize = 0.5;

  const maxMSLRiver = Math.max(...profile.map((p) => p.msl));
  const maxMSL = typeof bridgeLevel !== 'undefined'
    ? Math.max(maxMSLRiver, bridgeLevel + bridgeSize)
    : maxMSLRiver;
  const minMSL = Math.min(...profile.map((p) => p.msl));

  const maxWaterXL = useMemo(() => findHighestPoint(profile
    .slice(0, Math.round(profile.length / 2))), [profile]);
  const maxWaterXR = useMemo(() => findHighestPoint(profile
    .slice(Math.round(profile.length / 2) * -1)), [profile]);

  const intersections = findIntersections(profile, currentWaterLevel);

  const riverWidth = Math.max(...profile.map((p) => p.x));
  const riverAndBridgeHeight = maxMSL - minMSL;

  const padding = 5;
  const offsetRight = axis ? 55 : 0;
  const offsetBottom = axis ? 45 : 0;
  const bankPadding = 15;

  const totalWidth = width;
  const renderWidth = totalWidth - (padding * 2) - offsetRight;
  const renderHeight = ((riverAndBridgeHeight / riverWidth) * renderWidth);
  const totalHeight = renderHeight + bankPadding + (padding * 2) + offsetBottom;

  const xScale = useMemo(() => scaleLinear()
    .domain([0, riverWidth])
    .range([0, renderWidth]), [renderWidth, riverWidth]);

  const yScale = useMemo(() => scaleLinear()
    .domain([minMSL, maxMSL])
    .range([renderHeight, 0]), [maxMSL, minMSL, renderHeight])
    .nice();

  const xScaleProfile = useCallback(
    (x: number): number => xScale(x) + padding,
    [xScale],
  );
  const yScaleProfile = (msl: number): number => yScale(msl) + padding;
  const profilePointX = (d: ProfilePoint): number => xScaleProfile(d.x);
  const profilePointY = (d: ProfilePoint): number => yScaleProfile(d.msl);

  const xScaleWater = useMemo(() => {
    const leftX = intersections ? intersections[0].x : 0;
    const rightX = intersections ? intersections[1].x : 0;

    return scaleLinear()
      .domain([0, rightX - leftX])
      .range([0, xScaleProfile(rightX) - xScaleProfile(leftX)]);
  }, [intersections, xScaleProfile]);

  useEffect(() => {
    if (axisRightRef.current !== null && axisBottomRef.current !== null) {
      const rightAxis = axisRight(yScale);
      const bottomAxis = axisBottom(xScale);

      select(axisRightRef.current)
        .call(rightAxis);

      select(axisBottomRef.current)
        .call(bottomAxis);
    }

    if (rulerWaterRef.current !== null && intersections) {
      const maxTick = intersections[1].x - intersections[0].x;

      const waterAxis = axisTop(xScaleWater)
        .tickValues([
          0,
          maxTick / 4,
          maxTick / 2,
          maxTick / (4 / 3),
          maxTick,
        ]);

      select(rulerWaterRef.current)
        .call(waterAxis);
    }
  }, [intersections, xScale, xScaleWater, yScale]);

  const bankLine = area<ProfilePoint>()
    .x(profilePointX)
    .y(profilePointY)
    .y1(() => yScaleProfile(minMSL) + bankPadding)
    .curve(curveBasis);

  const firstPoint = profile[0];
  const lastPoint = profile[profile.length - 1];

  const bankPath = bankLine(profile);

  const waterLeft = typeof currentWaterLevel !== 'undefined' && currentWaterLevel > maxWaterXL.msl
    ? xScaleProfile(profile[0].x) : xScaleProfile(maxWaterXL.x);
  const waterRight = typeof currentWaterLevel !== 'undefined' && currentWaterLevel > maxWaterXR.msl
    ? xScaleProfile(profile[profile.length - 1].x) : xScaleProfile(maxWaterXR.x);

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

  const maxWaterPoint = yScaleProfile(currentWaterLevel || minMSL);
  const waterArea = area<ProfilePoint>()
    .x((d) => {
      const linePoint = profilePointX(d);

      if (linePoint < waterLeft) {
        return waterLeft;
      }

      if (linePoint > waterRight) {
        return waterRight;
      }

      return linePoint;
    })
    .y1((d) => {
      const linePoint = profilePointY(d);

      return maxWaterPoint < linePoint ? linePoint : maxWaterPoint;
    })
    .y0(() => maxWaterPoint)
    .curve(curveBasis);
  const waterAreaPath = waterArea(profile);

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
    >
      <defs>
        <linearGradient id="bridgeFill" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#000" stopOpacity={0.6} offset="0%" />
          <stop stopColor="#000" stopOpacity={0.7} offset="20%" />
        </linearGradient>
      </defs>
      {typeof bridgeLevel !== 'undefined' && (
        <path
          id="bridge"
          d={[bridgePath].join(' ')}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="url(#bridgeFill)"
        />
      )}
      {typeof currentWaterLevel !== 'undefined' && (
        <path
          id="water"
          d={[waterAreaPath].join(' ')}
          stroke={waterStrokeColor}
          strokeWidth={strokeWidth}
          fill={waterFill}
        />
      )}
      <path
        id="ground"
        d={[bankPath].join(' ')}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={groundFill}
      />
      {axis && (
        <>
          <g
            ref={axisRightRef}
            transform={`translate(${renderWidth + padding}, ${padding})`}
          />
          <text
            style={{ textAnchor: 'middle', transform: 'rotate(-90deg)', fontSize: '12px' }}
            y={36 + padding + renderWidth}
            x={(yScale(minMSL) / 2) * -1}
          >
            MSL
          </text>
          <g
            ref={axisBottomRef}
            transform={`translate(
              ${padding}, 
              ${yScaleProfile(minMSL) + bankPadding + padding + 3}
            )`}
          />
          <text
            style={{ textAnchor: 'middle', fontSize: '12px' }}
            y={yScaleProfile(minMSL) + bankPadding + padding + 38}
            x={padding + (xScale(riverWidth) / 2)}
          >
            Width (M)
          </text>
          {typeof currentWaterLevel !== 'undefined' && intersections && (
            <g
              ref={rulerWaterRef}
              transform={`translate(
                ${xScaleProfile(intersections[0].x)}, 
                ${yScaleProfile(currentWaterLevel || minMSL) - 10}
              )`}
            />
          )}
        </>
      )}
    </svg>
  );
};

export default Profile;
