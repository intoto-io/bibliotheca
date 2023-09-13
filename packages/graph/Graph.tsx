import { MouseEvent, TouchEvent, useMemo, useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { UseTranslationResponse } from 'react-i18next';
/* eslint-disable import/no-duplicates */ // needed to prevent eslint bug
import { format, compareDesc, startOfDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
/* eslint-enable */
import { bisector } from 'd3-array';
import { timeFormatDefaultLocale } from 'd3-time-format';

import Box from '@mui/material/Box';

import { Line as LineVisx } from '@visx/shape';
import { AxisRight, AxisTop } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { localPoint } from '@visx/event';

import tickFormat from './helpers/tickFormat';
import colorByIndex from './helpers/colorByIndex';
import locales from './helpers/locales';
import { isMissing, isPredicted } from './helpers/dataPoint';
import { createXScale, createYScale } from './helpers/createScales';
import { shiftSeriesDates } from './helpers/dateShift';
import { DataPoint, GraphLine, GraphSeries, TooltipValues } from './types';

import AxisLeft from './components/AxisLeft';
import Line from './components/Line';
import Bars from './components/Bars';
import Legend from './components/Legend';
import Navigation from './components/Navigation';
import Tooltip from './components/Tooltip';
import useSeriesDates from './hooks/useSeriesDates';
import useDimensions from './hooks/useDimensions';
import { isHorizontalLine } from './helpers/lineTypes';

export interface GraphProps {
  series: GraphSeries[];
  t: UseTranslationResponse<'graph'>['t'];
  height?: number;
  stacked?: boolean;
  navigation?: boolean;
  lang?: 'nb' | 'en';
  locale?: Locale;
  showCurrent?: boolean;
  lines?: GraphLine[];
  tooltip?: boolean;
  onTooltipValueChange?: (value: number | null) => void;
}

const bisectDate = bisector((d: DataPoint, x: Date) => {
  const date = new Date(d.date);

  if (date < x) {
    return 1;
  }

  if (date > x) {
    return -1;
  }

  return 0;
}).right;

function Graph({
  series: rawSeries,
  t,
  height = 200,
  tooltip = false,
  stacked = false,
  navigation = false,
  showCurrent = false,
  lang = 'en',
  locale = enUS,
  lines = [],
  onTooltipValueChange,
}: GraphProps) {
  const [ref, dimensions] = useDimensions();
  const isCondensed = dimensions.width < 500;
  const series = useMemo(() => shiftSeriesDates(rawSeries), [rawSeries]);

  useEffect(() => {
    // set the D3 locale
    timeFormatDefaultLocale(locales[lang]);
  }, [lang]);

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const currentValueRef = useRef<HTMLDivElement>(null);
  const [tooltipValues, setTooltipValues] = useState<TooltipValues | undefined>();

  const clearTooltip = useCallback(() => {
    if (onTooltipValueChange) {
      onTooltipValueChange(null);
    }

    setTooltipValues(undefined);
  }, [onTooltipValueChange]);

  const seriesReversed = useMemo(() => [...series].reverse(), [series]);

  const dates = useSeriesDates(series);

  const initialNavStart = dates[Math.ceil(dates.length / 3)];
  const initialNavEnd = dates[0];
  const [range, setRange] = useState<[number, number]>([+initialNavStart, +initialNavEnd]);

  const rangeDates = useMemo((): Date[] => {
    if (navigation) {
      return dates.filter((date) => +date >= range[0] && +date <= range[1]);
    }

    return dates;
  }, [dates, navigation, range]);

  const dateFormat = lang === 'nb' ? 'cccccc. d. LLL' : 'ccc, d. LLL';

  const padding = 30;
  const paddingRight = isCondensed ? 20 : 45;

  const heightWithPadding = (inputHeight: number) => inputHeight + padding * 2;

  const defaultLabelWidth = 44;
  const labelWidth = series[0].labelWidth || defaultLabelWidth;

  const graphDataWidth = useMemo(() => dimensions.width, [dimensions.width]);

  const totalWidth = graphDataWidth - labelWidth - paddingRight;
  const chartTotalHeight = heightWithPadding(height);

  const xScale = createXScale(rangeDates.length >= 2 ? rangeDates : dates, totalWidth);

  const yScales = useMemo(
    () =>
      series.map((plot) =>
        createYScale(
          plot,
          stacked && plot.axisHeight ? plot.axisHeight : height,
          lines.filter((line) => isHorizontalLine(line)).map((line) => (isHorizontalLine(line) ? line.value : 0)),
          padding,
        ),
      ),
    [height, lines, series, stacked],
  );

  const reversedIndex = (index: number) => seriesReversed.length - index - 1;

  const handleTooltip = useCallback(
    (
      event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>,
      clientX: number,
      clientY: number,
      offsetX = 10,
      offsetY = 0,
    ) => {
      // ignore when not using tooltip
      if (!tooltip) return;

      const coords = localPoint(event.target as Element, event);

      if (coords) {
        const date = xScale.invert(coords.x);
        const values = series.map((plot) => plot.data[bisectDate(plot.data, date)]);

        let xOffset = offsetX;

        if (graphContainerRef.current && tooltipRef.current && offsetX !== 0) {
          const graphContainerBounds = graphContainerRef.current.getBoundingClientRect();
          const tooltipBox = tooltipRef.current.getBoundingClientRect();

          if (clientX + tooltipBox.width + xOffset > graphContainerBounds.right) {
            xOffset = (tooltipBox.width + xOffset) * -1;
          }
        }

        if (onTooltipValueChange && values[0]) {
          onTooltipValueChange(values[0].value);
        }

        setTooltipValues({
          ...coords,
          values,
          tx: clientX + xOffset,
          ty: clientY + window.scrollY + offsetY,
        });
      }
    },
    [onTooltipValueChange, series, tooltip, xScale],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      handleTooltip(event, event.touches[0].clientX, event.touches[0].clientY, 0, -30);
    },
    [handleTooltip],
  );

  const handleMouseOver = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      handleTooltip(event, event.clientX, event.clientY);
    },
    [handleTooltip],
  );

  const currentValueOffset = ref.current?.getBoundingClientRect() || { top: 0, left: 0 };
  const currentPoint = series[0].data.find((d) => !isPredicted(d) && !isMissing(d));

  useLayoutEffect(() => {
    if (currentValueRef.current) {
      const rect = currentValueRef.current.getBoundingClientRect();

      if (window.innerWidth < rect.right) {
        // popup is out of viewport, move it to the left
        const rightMargin = 12;
        const left = rect.left - (rect.right - window.innerWidth) - rightMargin + rect.width / 2;
        currentValueRef.current.style.left = `${left}px`;
      }
    }
  });

  return (
    <div>
      <Box sx={{ display: 'flex' }} ref={ref}>
        {dimensions.width !== 0 && (
          <>
            {!tooltipValues && showCurrent && currentPoint && (
              <Box
                ref={currentValueRef}
                sx={{
                  position: 'absolute',
                  transform: ' translateY(-125%) translateX(-50%)',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  backgroundColor: '#fff',
                  p: 1,
                  borderRadius: '4px',
                  fontSize: isCondensed ? '0.8rem' : '1.5rem',
                  color: series[0].color || colorByIndex(0),
                  boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
                }}
                style={{
                  left: xScale(new Date(currentPoint.date)) + labelWidth + currentValueOffset.left + window.scrollX,
                  top: yScales[0](currentPoint.value) + currentValueOffset.top + window.scrollY,
                }}
              >
                {tickFormat(series[0], currentPoint.value)}
              </Box>
            )}
            <Tooltip
              tooltipRef={tooltipRef}
              tooltipValues={tooltipValues}
              series={series}
              locale={locale}
              missingText={t('missing')}
              isCondensed={isCondensed}
            />
            <Box
              sx={{
                flexShrink: 0,
                flexGrow: 0,
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {series.map((plot, index) => {
                if (index > 0 && !stacked) return null;

                const plotHeight = stacked && plot.axisHeight ? heightWithPadding(plot.axisHeight) : chartTotalHeight;

                return (
                  <AxisLeft
                    key={plot.key}
                    plot={series[index]}
                    height={plotHeight}
                    yScale={yScales[index]}
                    defaultLabelWidth={defaultLabelWidth}
                  />
                );
              })}
            </Box>
            <Box
              sx={{
                flexShrink: 1,
                flexGrow: 1,
                position: 'relative',
              }}
            >
              {lines.map((line) => {
                if (!line.indicator) {
                  return null;
                }

                const arrowProps = isHorizontalLine(line)
                  ? {
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: `5px solid ${line.color}`,
                    }
                  : {
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: `5px solid ${line.color}`,
                    };

                return (
                  <Box
                    key={`line_${line.name}`}
                    sx={{
                      ...arrowProps,
                      position: 'absolute',
                      display: 'block',
                      width: 0,
                      height: 0,
                      transform: isHorizontalLine(line) ? 'translate(-100%, -50%)' : 'translate(-50%, -100%)',
                      left: isHorizontalLine(line) ? 0 : xScale(line.date),
                      top: isHorizontalLine(line) ? yScales[0](line.value) : padding,
                      opacity: line.opacity,
                    }}
                  />
                );
              })}
              <Box
                sx={{
                  maxWidth: '100%',
                  overflow: navigation ? 'visible' : 'hidden',
                  touchAction: 'none',
                }}
                className="GraphContainer"
                ref={graphContainerRef}
                onTouchMove={handleTouchMove}
                onMouseMove={handleMouseOver}
                onMouseLeave={clearTooltip}
              >
                {series.map((plot, index) => {
                  if (!stacked && index > 0) return null;

                  const columnsHeight = stacked && plot.axisHeight ? plot.axisHeight : height;

                  return (
                    <Box
                      component="svg"
                      key={`${plot.key}_${stacked ? 'stacked' : 'combined'}`}
                      width={totalWidth}
                      height={heightWithPadding(columnsHeight)}
                      sx={{
                        direction: 'ltr',
                        display: 'block',
                        position: 'relative',
                        zIndex: 2,
                        overflow: 'visible',
                      }}
                    >
                      <GridRows scale={yScales[index]} width={totalWidth} stroke="#ccc" strokeOpacity={0.7} />
                      <GridColumns scale={xScale} height={columnsHeight} top={padding} stroke="#ccc" />
                      {index === 0 && (
                        <AxisTop
                          top={padding}
                          scale={xScale}
                          numTicks={isCondensed ? 4 : undefined}
                          tickFormat={(tick) => {
                            const date = tick.valueOf();

                            if (compareDesc(startOfDay(date), date) === 0) {
                              return format(date, dateFormat, { locale });
                            }

                            return format(date, 'p', { locale });
                          }}
                        />
                      )}
                      {seriesReversed.map((innerPlot, i) => {
                        const ri = reversedIndex(i);

                        if (stacked && index !== ri) return null;

                        const { type } = innerPlot;

                        const plotHeight = stacked && plot.axisHeight ? plot.axisHeight + padding : height + padding;

                        if (type === 'bar') {
                          return (
                            <Bars
                              key={`${innerPlot.key}_${plot.key}`}
                              plot={innerPlot}
                              barWidth={innerPlot.barWidth}
                              barPadding={typeof innerPlot.barPadding !== 'undefined' ? innerPlot.barPadding : 4}
                              xScale={xScale}
                              yScale={yScales[ri]}
                              height={plotHeight}
                              index={ri}
                              lastDate={dates[0]}
                            />
                          );
                        }

                        return (
                          <Line
                            key={`${innerPlot.key}_${plot.key}`}
                            keyRef={`${innerPlot.key}_${plot.key}`}
                            plot={innerPlot}
                            xScale={xScale}
                            yScale={yScales[ri]}
                            index={ri}
                            navigation={navigation}
                          />
                        );
                      })}
                      {tooltipValues && tooltipValues.values[0] && (
                        <>
                          <LineVisx
                            from={{ x: xScale(new Date(tooltipValues.values[0].date)), y: padding }}
                            to={{
                              x: xScale(new Date(tooltipValues.values[0].date)),
                              y: columnsHeight + padding,
                            }}
                            stroke={plot.color || colorByIndex(index)}
                            strokeWidth={1}
                            strokeOpacity={0.8}
                            pointerEvents="none"
                            strokeDasharray="5,5"
                          />
                          {tooltipValues.values.map((v, i) => (
                            <circle
                              key={`circle_${v.value}_${v.date}`}
                              cx={xScale(new Date(v.date))}
                              cy={yScales[i](v.value)}
                              r={4}
                              fill={plot.color || colorByIndex(index)}
                              stroke="white"
                              strokeWidth={2}
                              pointerEvents="none"
                            />
                          ))}
                        </>
                      )}
                      {!tooltipValues && showCurrent && currentPoint && (
                        <circle
                          cx={xScale(new Date(currentPoint.date))}
                          cy={yScales[0](currentPoint.value)}
                          r={4}
                          fill={plot.color || colorByIndex(index)}
                          stroke="white"
                          strokeWidth={2}
                          pointerEvents="none"
                        />
                      )}
                      {lines.map((line) => (
                        <LineVisx
                          key={line.name}
                          from={
                            isHorizontalLine(line)
                              ? {
                                  x: xScale(rangeDates[0]),
                                  y: yScales[0](line.value),
                                }
                              : {
                                  x: xScale(line.date),
                                  y: padding,
                                }
                          }
                          to={
                            isHorizontalLine(line)
                              ? {
                                  x: xScale(rangeDates[rangeDates.length - 1]),
                                  y: yScales[0](line.value),
                                }
                              : {
                                  x: xScale(line.date),
                                  y: columnsHeight + padding,
                                }
                          }
                          stroke={line.color}
                          strokeWidth={line.width || 1.5}
                          pointerEvents="none"
                          strokeDasharray={line.dasharray || '5,3'}
                        />
                      ))}
                    </Box>
                  );
                })}
              </Box>
              <Legend
                isCondensed={isCondensed}
                stacked={stacked}
                series={series}
                locale={locale}
                currentPoint={showCurrent ? currentPoint : undefined}
                paddingRight={paddingRight}
                lines={lines}
                translations={{
                  updated_at: t('updated_at'),
                  missing: t('missing'),
                  predicted: t('predicted'),
                }}
              />
            </Box>
            {series.length > 1 && (
              <Box
                sx={{
                  flexShrink: 0,
                  flexGrow: 0,
                  textAlign: 'right',
                }}
              >
                {series.map((plot, index) =>
                  stacked || index === 0 ? null : (
                    <svg key={plot.key} width={plot.labelWidth || defaultLabelWidth} height={chartTotalHeight}>
                      <AxisRight
                        scale={yScales[index]}
                        tickFormat={(tick) => tickFormat(plot, tick.valueOf())}
                        stroke={plot.color || colorByIndex(index)}
                        tickStroke={plot.color || colorByIndex(index)}
                        tickLabelProps={() => ({
                          fill: plot.color || colorByIndex(index),
                          fontSize: 10,
                          x: 10,
                          textAnchor: 'start',
                          verticalAnchor: 'middle',
                        })}
                      />
                    </svg>
                  ),
                )}
              </Box>
            )}
          </>
        )}
      </Box>
      {navigation && dimensions.width !== 0 && (
        <div>
          <Navigation
            dates={dates}
            width={dimensions.width}
            series={seriesReversed}
            paddingLeft={labelWidth}
            paddingRight={padding}
            range={range}
            setRange={setRange}
          />
        </div>
      )}
    </div>
  );
}

export default Graph;
