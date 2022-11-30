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
import { axisRight } from 'd3-axis';
import { select } from 'd3-selection';
import styled from '@mui/styled-engine';

import findIntersections from './helpers/findIntersections';
import calcWaterVolume from './helpers/calcWaterVolume';
import bridgeLine from './helpers/bridgeLine';

import { ProfilePoint, RiverProfile } from './types';

const StyledSection = styled('section')({
  display: 'flex',
  flexDirection: 'column',
});

const Legend = styled('ul')({
  display: 'flex',
  justifyContent: 'flex-end',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const LegendItem = styled('li')({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '1rem',
  fontSize: 12,
});

const LegendIconMean = styled('span')({
  display: 'block',
  width: 0,
  height: 0,
  borderTop: '6px solid transparent',
  borderBottom: '6px solid transparent',
  borderRight: '6px solid red',
  marginRight: 5,
});

export interface ProfileProps {
  profile?: RiverProfile;
  riverWidth?: number;
  currentWaterLevel?: number;
  bridgeLevel?: number;
  bridgeHeight?: number;
  bridgeStrokeWidth?: number;
  meanLevel?: number;
  axis?: boolean;
  width?: number;
  groundStroke?: boolean;
  groundGradient?: boolean;
  groundFill?: string;
  strokeColor?: string;
  strokeWidth?: number;
  waterStrokeColor?: string;
  meanStrokeColor?: string;
  bridgeStrokeColor?: string;
  waterFill?: string;
  mslLabel?: string;
  meanLabel?: string;
  formatDistance?: (d: number) => string;
}

const closedLine = line().curve(curveLinearClosed);

const findHighestPoint = (items: RiverProfile): ProfilePoint => items.reduce((a, b) => {
  if (b.msl > a.msl) {
    return b;
  }

  return a;
}, { x: 0, msl: 0 });

const Profile: FunctionComponent<ProfileProps> = function Profile({
  profile: riverProfile,
  riverWidth: rw = 10,
  currentWaterLevel,
  meanLevel,
  bridgeLevel,
  bridgeHeight = 1.2,
  bridgeStrokeWidth = 2,
  axis = false,
  width = 600,
  groundStroke = false,
  groundGradient = true,
  strokeColor = 'black',
  strokeWidth = 1.5,
  waterStrokeColor = '#0633ff',
  meanStrokeColor = '#b7323f',
  bridgeStrokeColor = 'black',
  waterFill = '#99ccff',
  groundFill = '#b4967d',
  mslLabel = 'MASL',
  meanLabel = 'Mean-level',
  formatDistance = (d: number) => `${(d / 100).toFixed(1)} m`,
}) {
  const profile: RiverProfile = riverProfile || [
    { x: 0, msl: currentWaterLevel || 0 },
    { x: 0, msl: 0 },
    { x: rw, msl: 0 },
    { x: rw, msl: currentWaterLevel || 0 },
  ];
  const hasBank = !!riverProfile;
  const riverCurve = hasBank ? curveBasis : curveLinearClosed;

  const axisRightRef = useRef<SVGGElement>(null);

  const maxMSLRiver = Math.max(...profile.map((p) => p.msl));
  const maxMSL = typeof bridgeLevel !== 'undefined'
    ? Math.max(maxMSLRiver, bridgeLevel + bridgeHeight)
    : maxMSLRiver;
  const minMSL = Math.min(...profile.map((p) => p.msl));

  const maxWaterXL = useMemo(() => findHighestPoint(profile
    .slice(0, Math.round(profile.length / 2))), [profile]);
  const maxWaterXR = useMemo(() => findHighestPoint(profile
    .slice(Math.round(profile.length / 2) * -1)), [profile]);

  const intersections = findIntersections(profile, currentWaterLevel);
  const waterVolume = calcWaterVolume(profile, intersections);

  const riverWidth = Math.max(...profile.map((p) => p.x));
  const riverAndBridgeHeight = maxMSL - minMSL;

  const padding = 5;
  const offsetRight = axis ? 55 : 0;
  const offsetBottom = 0;
  const bankPadding = 15;
  const rulerOffset = 8;
  const rulerTickSize = 8;

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
    if (axisRightRef.current !== null) {
      const rightAxis = axisRight(yScale);

      select(axisRightRef.current)
        .call(rightAxis);
    }
  }, [yScale]);

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

  const [bridgePath, bridgeSupportPath] = bridgeLine(
    xScaleProfile,
    yScaleProfile,
    firstPoint,
    lastPoint,
    bridgeLevel,
    bridgeHeight,
  );

  const bridgePathLine = line()(bridgePath);
  const bridgeSupportPathLine = line()(bridgeSupportPath);

  const waterRulerPath = line()(
    typeof currentWaterLevel !== 'undefined' ? [
      [xScaleWater(xScaleWater.domain()[0]), -(rulerTickSize / 2)],
      [xScaleWater(xScaleWater.domain()[0]), rulerTickSize / 2],
      [xScaleWater(xScaleWater.domain()[0]), 0],
      [xScaleWater(xScaleWater.domain()[1]), 0],
      [xScaleWater(xScaleWater.domain()[1]), rulerTickSize / 2],
      [xScaleWater(xScaleWater.domain()[1]), -(rulerTickSize / 2)],
    ] : [],
  );

  const maxWaterPoint = yScaleProfile(currentWaterLevel || minMSL);
  const waterArea = area<ProfilePoint>()
    .x((d) => {
      const linePoint = profilePointX(d);

      if (intersections && linePoint < xScaleProfile(intersections[0].x)) {
        return xScaleProfile(intersections[0].x);
      }

      if (intersections && linePoint > xScaleProfile(intersections[1].x)) {
        return xScaleProfile(intersections[1].x);
      }

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
    .curve(riverCurve);
  const waterAreaPath = waterArea(profile);

  const indicatorSize = 5;
  const axisOffset = 5;

  const meanIndicatorPath = closedLine(
    typeof meanLevel !== 'undefined' ? [
      [xScaleProfile(riverWidth) + axisOffset, yScaleProfile(meanLevel)],
      [
        xScaleProfile(riverWidth) + axisOffset + indicatorSize,
        yScaleProfile(meanLevel) + indicatorSize,
      ],
      [
        xScaleProfile(riverWidth) + axisOffset + indicatorSize,
        yScaleProfile(meanLevel) - indicatorSize,
      ],
    ] : [],
  );

  const hasLegend = [
    typeof meanLevel !== 'undefined',
  ].some(Boolean);

  return (
    <StyledSection style={{ width: totalWidth }}>
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      >
        {groundGradient && (
          <defs>
            <linearGradient id="ground-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor={groundFill} stopOpacity={1} offset="0%" />
              <stop stopColor={groundFill} stopOpacity={0.9} offset="5%" />
              <stop stopColor={groundFill} stopOpacity={0.2} offset="100%" />
            </linearGradient>
          </defs>
        )}
        {hasBank && (
          <>
            <mask id="ground-mask" maskUnits="userSpaceOnUse">
              <rect x="0" y="0" width={totalWidth} height={totalHeight} fill="white" />
              <path
                d={[bankPath].join(' ')}
                fill="black"
                stroke="white"
                strokeWidth={strokeWidth}
              />
            </mask>
            <path
              id="ground"
              d={[bankPath].join(' ')}
              stroke={strokeColor}
              strokeWidth={groundStroke ? strokeWidth : 0}
              fill={groundGradient ? 'url(#ground-gradient)' : groundFill}
            />
          </>
        )}
        {typeof currentWaterLevel !== 'undefined' && (
          <>
            <defs>
              <linearGradient id="water-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop stopColor={waterFill} stopOpacity={1} offset="0%" />
                <stop stopColor={waterFill} stopOpacity={0.6} offset="100%" />
              </linearGradient>
            </defs>
            <path
              id="water"
              d={[waterAreaPath].join(' ')}
              stroke={waterStrokeColor}
              strokeWidth={strokeWidth}
              fill="url(#water-gradient)"
              mask="url(#ground-mask)"
            />
          </>
        )}
        {typeof bridgeLevel !== 'undefined' && (
          <>
            <path
              id="bridge-support"
              d={[bridgeSupportPathLine].join(' ')}
              stroke={bridgeStrokeColor}
              strokeWidth={bridgeStrokeWidth}
              strokeOpacity={0.5}
              fill="transparent"
            />
            <path
              id="bridge"
              d={[bridgePathLine].join(' ')}
              stroke={bridgeStrokeColor}
              strokeWidth={bridgeStrokeWidth}
              fill="transparent"
            />
          </>
        )}
        {typeof meanLevel !== 'undefined' && (
          <g>
            <line
              id="mean"
              x1={xScaleProfile(0)}
              x2={xScaleProfile(riverWidth)}
              y1={yScaleProfile(meanLevel)}
              y2={yScaleProfile(meanLevel)}
              stroke={meanStrokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray="5, 3"
            />
            <path
              id="mean-indicator"
              d={[meanIndicatorPath].join(' ')}
              fill={meanStrokeColor}
            />
          </g>
        )}
        {axis && (
          <g>
            <g
              ref={axisRightRef}
              transform={`translate(${renderWidth + padding + axisOffset}, ${padding})`}
            />
            <text
              style={{ textAnchor: 'middle', transform: 'rotate(-90deg)', fontSize: '12px' }}
              y={36 + axisOffset + padding + renderWidth}
              x={(yScale(minMSL) / 2) * -1}
            >
              {mslLabel}
            </text>
            {typeof currentWaterLevel !== 'undefined' && intersections && (
              <g
                transform={`translate(
                  ${xScaleProfile(intersections[0].x)}, 
                  ${yScaleProfile(currentWaterLevel || minMSL) - rulerOffset}
                )`}
              >
                <path
                  id="water-ruler"
                  d={[waterRulerPath].join(' ')}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fillOpacity={0}
                />
                <text
                  textAnchor="middle"
                  transform={
                    `translate(${xScaleProfile((intersections[1].x - intersections[0].x) / 2)}, -5)`
                  }
                  fontSize={12}
                >
                  {formatDistance((intersections[1].x - intersections[0].x) * 100)}
                  {' / '}
                  {formatDistance(waterVolume * 100)}
                  <tspan dy="-4" fontSize={9}>2</tspan>
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
      {hasLegend && (
        <Legend style={{ paddingRight: offsetRight + padding }}>
          {typeof meanLevel !== 'undefined' && (
            <LegendItem>
              <LegendIconMean
                style={{
                  borderRightColor: meanStrokeColor,
                  borderRightWidth: indicatorSize,
                  borderTopWidth: indicatorSize,
                  borderBottomWidth: indicatorSize,
                }}
              />
              {meanLabel}
            </LegendItem>
          )}
        </Legend>
      )}
    </StyledSection>
  );
};

export default Profile;
