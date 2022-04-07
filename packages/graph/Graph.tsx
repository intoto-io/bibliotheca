import {
  FunctionComponent,
  MouseEvent,
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';
/* eslint-disable import/no-duplicates */ // needed to prevent eslint bug
import {
  format,
  compareDesc,
  startOfDay,
} from 'date-fns';
import enUS from 'date-fns/locale/en-US';
/* eslint-enable */
import { bisector } from 'd3-array';
import { timeFormatDefaultLocale } from 'd3-time-format';
import { UseTranslationResponse } from 'react-i18next';

import { Line as LineVisx } from '@visx/shape';
import { AxisRight, AxisTop } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { localPoint } from '@visx/event';
import { defaultStyles } from '@visx/tooltip';

import tickFormat from './helpers/tickFormat';
import colorByIndex from './helpers/colorByIndex';
import locales from './helpers/locales';
import { valueInThreshold } from './helpers/hasValueInThreshold';
import { isMissing, isPredicted } from './helpers/dataPoint';
import { createXScale, createYScale } from './helpers/createScales';
import { shiftSeriesDates } from './helpers/dateShift';
import { DataPoint, GraphSeries } from './types';

import AxisLeft from './components/AxisLeft';
import Line from './components/Line';
import Bars from './components/Bars';
import Legend from './components/Legend';
import useSeriesDates from './hooks/useSeriesDates';
import useDimensions from './hooks/useDimensions';
import Navigation from './components/Navigation';

const PREFIX = 'Graph';

const classes = {
  container: `${PREFIX}-container`,
  yAxis: `${PREFIX}-yAxis`,
  yAxisRight: `${PREFIX}-yAxisRight`,
  graphContainer: `${PREFIX}-graphContainer`,
  graphContainerNavigation: `${PREFIX}-graphContainerNavigation`,
  graphLegendContainer: `${PREFIX}-graphLegendContainer`,
  graph: `${PREFIX}-graph`,
  legend: `${PREFIX}-legend`,
  tooltip: `${PREFIX}-tooltip`,
  tooltipCurrent: `${PREFIX}-tooltipCurrent`,
  tooltipCell: `${PREFIX}-tooltipCell`,
};

const Root = styled('div')({
  [`& .${classes.container}`]: {
    display: 'flex',
  },
  [`& .${classes.yAxis}`]: {
    flexShrink: 0,
    flexGrow: 0,
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  [`& .${classes.yAxisRight}`]: {
    flexShrink: 0,
    flexGrow: 0,
    textAlign: 'right',
  },
  [`& .${classes.graphContainer}`]: {
    maxWidth: '100%',
  },
  [`& .${classes.graphContainerNavigation}`]: {
    overflow: 'visible',
  },
  [`& .${classes.graphLegendContainer}`]: {
    flexShrink: 1,
    flexGrow: 1,
    position: 'relative',
  },
  [`& .${classes.graph}`]: {
    direction: 'ltr',
    display: 'block',
    position: 'relative',
    zIndex: 2,
    overflow: 'visible',
  },
  [`& .${classes.tooltip}`]: {
    position: 'absolute',
    transform: 'translateY(-50%)',
    fontSize: '0.6em',
    zIndex: 10,
  },
  [`& .${classes.tooltipCurrent}`]: {
    position: 'absolute',
    transform: ' translateY(-50%) translateX(5px)',
    whiteSpace: 'nowrap',
    zIndex: 10,
    backgroundColor: '#fff',
    padding: '3px 5px',
    borderRadius: '4px',
    fontSize: '0.8em',
    boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.3)',
  },
  [`& .${classes.tooltipCell}`]: {
    whiteSpace: 'nowrap',
  },
});

const MeanLevelIndicator = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'block',
  width: 0,
  height: 0,
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
  borderLeft: '5px solid red',
  transform: 'translateY(-50%)',
});

export interface GraphProps {
  series: GraphSeries[];
  t: UseTranslationResponse<'graph'>['t'];
  height?: number;
  stacked?: boolean;
  navigation?: boolean;
  lang?: 'nb' | 'en';
  locale?: Locale;
  now?: Date;
  showCurrent?: boolean;
  meanLevel?: number;
  meanLevelStrokeColor?: string;
  tooltip?: boolean;
  onTooltipValueChange?: (value: number | null) => void;
}

interface TooltipValues {
  values: DataPoint[];
  x: number;
  y: number;
  tx: number;
  ty: number;
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

const Graph: FunctionComponent<GraphProps> = function Graph({
  series: rawSeries,
  t,
  height = 200,
  tooltip = false,
  stacked = false,
  navigation = false,
  showCurrent = false,
  lang = 'en',
  locale = enUS,
  now,
  meanLevel,
  meanLevelStrokeColor = '#b7323f',
  onTooltipValueChange,
}) {
  const [ref, dimensions] = useDimensions();
  const series = useMemo(() => shiftSeriesDates(rawSeries), [rawSeries]);

  useEffect(() => {
    // set the D3 locale
    timeFormatDefaultLocale(locales[lang]);
  }, [lang]);

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipValues, setTooltipValues] = useState<TooltipValues | undefined>();

  const clearTooltip = useCallback(() => {
    if (onTooltipValueChange) {
      onTooltipValueChange(null);
    }

    setTooltipValues(undefined);
  }, [onTooltipValueChange]);

  const seriesReversed = useMemo(() => [...series].reverse(), [series]);

  const dates = useSeriesDates(series);

  const initialNavStart = dates[Math.ceil(dates.length / 10)];
  const initialNavEnd = dates[0];
  const [range, setRange] = useState<[number, number]>([+initialNavStart, +initialNavEnd]);

  const rangeDates = useMemo((): Date[] => {
    if (navigation) {
      return dates.filter((date) => +date >= range[0] && +date <= range[1]);
    }

    return dates;
  }, [dates, navigation, range]);

  const dateFormat = lang === 'nb' ? 'cccccc. d. LLL' : 'ccc, d. LLL';
  const dateFormatWithTime = 'Pp';

  const padding = 30;

  const heightWithPadding = (inputHeight: number) => inputHeight + (padding * 2);

  const defaultLabelWidth = 44;
  const labelWidth = series[0].labelWidth || defaultLabelWidth;

  const graphDataWidth = useMemo(() => dimensions.width, [dimensions.width]);

  const totalWidth = graphDataWidth - labelWidth - padding;
  const chartTotalHeight = heightWithPadding(height);

  const xScale = createXScale(rangeDates.length >= 2 ? rangeDates : dates, totalWidth);

  const yScales = useMemo(
    () => series.map((plot) => createYScale(
      plot,
      stacked && plot.axisHeight ? plot.axisHeight : height,
      padding,
    )),
    [height, series, stacked],
  );

  const reversedIndex = (index: number) => seriesReversed.length - index - 1;

  const handleMouseOver = useCallback((event: MouseEvent<HTMLDivElement>) => {
    // ignore when not using tooltip
    if (!tooltip) return;

    const coords = localPoint(event.target as Element, event);

    if (coords) {
      const date = xScale.invert(coords.x);
      const values = series.map((plot) => plot.data[bisectDate(plot.data, date)]);

      let xOffset = 10;

      if (graphContainerRef.current && tooltipRef.current) {
        const graphContainerBounds = graphContainerRef.current.getBoundingClientRect();
        const tooltipBox = tooltipRef.current.getBoundingClientRect();

        if (event.clientX + tooltipBox.width + xOffset > graphContainerBounds.right) {
          xOffset = (tooltipBox.width + xOffset) * -1;
        }
      }

      if (onTooltipValueChange && values[0]) {
        onTooltipValueChange(values[0].value);
      }

      setTooltipValues({
        ...coords,
        values,
        tx: event.clientX + xOffset,
        ty: event.clientY + window.scrollY,
      });
    }
  }, [onTooltipValueChange, series, tooltip, xScale]);

  const currentValueOffset = ref.current?.getBoundingClientRect() || { top: 0, left: 0 };
  const currentPoint = series[0].data.find((d) => !isPredicted(d));

  return (
    <Root>
      <div className={classes.container} ref={ref}>
        {!tooltipValues && showCurrent && currentPoint && (
          <div
            className={classes.tooltipCurrent}
            style={{
              left: xScale(new Date(currentPoint.date))
                + labelWidth + currentValueOffset.left + window.scrollX,
              top: yScales[0](currentPoint.value) + currentValueOffset.top + window.scrollY,
            }}
          >
            {tickFormat(series[0], currentPoint.value)}
          </div>
        )}
        {tooltipValues && tooltipValues?.values && tooltipValues.values[0] && (
          <div
            ref={tooltipRef}
            className={classNames(classes.tooltip, 'GraphTooltip')}
            style={{
              ...defaultStyles,
              top: tooltipValues.ty,
              left: tooltipValues.tx,
            }}
          >
            <table>
              <tbody>
                <tr key="date">
                  <td colSpan={2}>
                    {format(new Date(tooltipValues.values[0].date), dateFormatWithTime, { locale })}
                  </td>
                </tr>
                {series.map((plot, index) => {
                  const color = typeof plot.threshold !== 'undefined' && valueInThreshold(
                    tooltipValues.values[index].value,
                    plot.threshold,
                    plot.thresholdDirection,
                  ) ? plot.thresholdColor : plot.color || colorByIndex(index);

                  if (!tooltipValues.values[index]) {
                    return null;
                  }

                  return (
                    <tr key={plot.key}>
                      <td
                        className={classes.tooltipCell}
                        style={{ color }}
                      >
                        {`${plot.name}:`}
                      </td>
                      <td
                        className={classes.tooltipCell}
                        style={{ color }}
                      >
                        {isMissing(tooltipValues.values[index])
                          ? t('missing')
                          : tickFormat(plot, tooltipValues.values[index].value)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className={classes.yAxis}>
          {series.map((plot, index) => {
            if (index > 0 && !stacked) return null;

            const plotHeight = stacked && plot.axisHeight
              ? heightWithPadding(plot.axisHeight)
              : chartTotalHeight;

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
          {typeof meanLevel !== 'undefined' && (
            <MeanLevelIndicator
              style={{
                top: yScales[0](meanLevel),
                borderLeftColor: meanLevelStrokeColor,
              }}
            />
          )}
        </div>
        <div className={classes.graphLegendContainer}>
          <div
            className={
              classNames(
                classes.graphContainer,
                { [classes.graphContainerNavigation]: navigation },
                'GraphContainer',
              )
            }
            ref={graphContainerRef}
            onMouseMove={handleMouseOver}
            onMouseLeave={clearTooltip}
          >
            {series.map((plot, index) => {
              if (!stacked && index > 0) return null;

              const columnsHeight = stacked && plot.axisHeight ? plot.axisHeight : height;

              return (
                <svg
                  key={`${plot.key}_${stacked ? 'stacked' : 'combined'}`}
                  width={totalWidth}
                  height={heightWithPadding(columnsHeight)}
                  className={classes.graph}
                >
                  <GridRows
                    scale={yScales[index]}
                    width={totalWidth}
                    stroke="#ccc"
                    strokeOpacity={0.7}
                  />
                  <GridColumns
                    scale={xScale}
                    height={columnsHeight}
                    top={padding}
                    stroke="#ccc"
                  />
                  {index === 0 && (
                    <AxisTop
                      top={padding}
                      scale={xScale}
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

                    const plotHeight = stacked && plot.axisHeight
                      ? plot.axisHeight + padding
                      : height + padding;

                    if (type === 'bar') {
                      return (
                        <Bars
                          key={`${innerPlot.key}_${plot.key}`}
                          plot={innerPlot}
                          barWidth={innerPlot.barWidth}
                          barPadding={typeof innerPlot.barPadding !== 'undefined'
                            ? innerPlot.barPadding : 4}
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
                  {now && (
                    <LineVisx
                      from={{ x: xScale(now), y: padding }}
                      to={{ x: xScale(now), y: columnsHeight + padding }}
                      stroke="#000"
                      strokeWidth={1}
                      strokeOpacity={0.5}
                      pointerEvents="none"
                      strokeDasharray="8,8"
                    />
                  )}
                  {typeof meanLevel !== 'undefined' && (
                    <LineVisx
                      from={{ x: xScale(rangeDates[0]), y: yScales[0](meanLevel) }}
                      to={{
                        x: xScale(rangeDates[rangeDates.length - 1]),
                        y: yScales[0](meanLevel),
                      }}
                      stroke={meanLevelStrokeColor}
                      strokeWidth={1.5}
                      pointerEvents="none"
                      strokeDasharray="5,3"
                    />
                  )}
                </svg>
              );
            })}
          </div>
          <Legend
            stacked={stacked}
            series={series}
            meanLevel={meanLevel}
            meanLevelStrokeColor={meanLevelStrokeColor}
            locale={locale}
            currentPoint={showCurrent ? currentPoint : undefined}
            padding={padding}
            translations={{
              updated_at: t('updated_at'),
              missing: t('missing'),
              predicted: t('predicted'),
              meanLevel: t('mean_level'),
            }}
          />
        </div>
        {series.length > 1 && (
          <div className={classes.yAxisRight}>
            {series.map((plot, index) => (stacked || index === 0 ? null : (
              <svg
                key={plot.key}
                width={plot.labelWidth || defaultLabelWidth}
                height={chartTotalHeight}
              >
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
            )))}
          </div>
        )}
      </div>
      {navigation && (
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
    </Root>
  );
};

export default Graph;
