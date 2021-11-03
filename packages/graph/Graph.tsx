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
/* eslint-disable import/no-duplicates */ // needed to prevent eslint bug
import {
  format,
  compareDesc,
  startOfDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
/* eslint-enable */
import { bisector } from 'd3-array';
import { timeFormatDefaultLocale } from 'd3-time-format';
import { UseTranslationResponse } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import { Line as LineVisx } from '@visx/shape';
import { AxisRight, AxisTop } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { localPoint } from '@visx/event';
import { defaultStyles } from '@visx/tooltip';

import tickFormat from './helpers/tickFormat';
import colorByIndex from './helpers/colorByIndex';
import locales from './helpers/locales';
import { valueInThreshold } from './helpers/hasValueInThreshold';
import { isMissing } from './helpers/dataPoint';
import { createXScale, createYScale } from './helpers/createScales';
import { DataPoint, GraphSeries } from './types';

import AxisLeft from './components/AxisLeft';
import Line from './components/Line';
import Bars from './components/Bars';
import Legend from './components/Legend';
import useSeriesFacts from './hooks/useSeriesFacts';
import useDimensions from './hooks/useDimensions';
import Navigation from './components/Navigation';

const useStyles = makeStyles(({
  container: {
    display: 'flex',
  },
  yAxis: {
    flexShrink: 0,
    flexGrow: 0,
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
  },
  yAxisRight: {
    flexShrink: 0,
    flexGrow: 0,
    textAlign: 'right',
  },
  graphContainer: {
    overflowX: 'scroll',
    direction: 'rtl',
    position: 'absolute',
    maxWidth: '100%',
    zIndex: 2,
  },
  graphContainerNavigation: {
    overflow: 'visible',
  },
  graphLegendContainer: {
    flexShrink: 1,
    flexGrow: 1,
    position: 'relative',
  },
  graph: {
    direction: 'ltr',
    display: 'block',
  },
  legend: {
    display: 'flex',
    position: 'absolute',
    direction: 'ltr',
    fontSize: '0.75em',
    right: 30,
    top: -5,
    alignItems: 'flex-end',
    zIndex: 1,
  },
  tooltip: {
    position: 'absolute',
    transform: 'translateY(-50%)',
    fontSize: '0.6em',
    zIndex: 10,
  },
  tooltipCell: {
    whiteSpace: 'nowrap',
  },
}));

type Specificity = 'daily' | 'hourly' | 'minutely';

export interface GraphProps {
  series: GraphSeries[];
  t: UseTranslationResponse<'graph'>['t'];
  entryWidth?: number;
  height?: number;
  stacked?: boolean;
  specificity?: Specificity;
  navigation?: boolean;
  lang?: 'nb' | 'en';
  locale?: Locale;
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

const bisectDate = bisector((d: DataPoint, x: Date) => compareDesc(d.date, x)).right;

const Graph: FunctionComponent<GraphProps> = ({
  series,
  t,
  height = 200,
  entryWidth = 25,
  tooltip = false,
  stacked = false,
  navigation = false,
  specificity = 'daily',
  lang = 'en',
  locale = enUS,
  onTooltipValueChange,
}) => {
  const styles = useStyles();
  const [ref, dimensions] = useDimensions();

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

  const { dates, numberOfDays, dataPointsPerDay } = useSeriesFacts(series);

  const initialNavStart = dates[Math.ceil(dates.length / 10)];
  const initialNavEnd = dates[0];
  const [range, setRange] = useState<[number, number]>([+initialNavStart, +initialNavEnd]);
  const rangeDates = navigation
    ? dates.filter((date) => +date >= range[0] && +date <= range[1])
    : dates;

  const dateFormat = lang === 'nb' ? 'cccccc. d. LLL' : 'ccc, d. LLL';
  const dateFormatWithTime = 'Pp';

  const padding = 30;

  const heightWithPadding = (inputHeight: number) => inputHeight + (padding * 2);

  const defaultLabelWidth = 44;
  const labelWidth = series[0].labelWidth || defaultLabelWidth;

  const dateWidth = entryWidth * dataPointsPerDay;

  const width = useMemo(() => {
    if (navigation) {
      return dimensions.width;
    }

    if (numberOfDays > 1) {
      return numberOfDays * entryWidth * dataPointsPerDay;
    }

    return entryWidth * dataPointsPerDay;
  }, [dataPointsPerDay, dimensions.width, entryWidth, navigation, numberOfDays]);

  const totalWidth = navigation ? width - labelWidth - padding : width + padding;
  const chartTotalHeight = heightWithPadding(height);

  const xScale = createXScale(rangeDates.length >= 2 ? rangeDates : dates, width);

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
      const tooltipDataPositionOffset = entryWidth / 2;
      const date = xScale.invert(coords.x + tooltipDataPositionOffset);
      const values = series.map((plot) => plot.data[bisectDate(plot.data, date)]);

      let xOffset = 10;

      if (graphContainerRef.current) {
        const graphContainerRefBox = graphContainerRef.current.getBoundingClientRect();

        if (
          event.clientX
          > graphContainerRefBox.right - Math.max(padding + graphContainerRef.current.scrollLeft, 0)
        ) {
          clearTooltip();
          return;
        }

        if (tooltipRef.current && graphContainerRef.current) {
          const tooltipBox = tooltipRef.current.getBoundingClientRect();

          if (event.clientX + tooltipBox.width > graphContainerRefBox.right) {
            xOffset = (tooltipBox.width + xOffset) * -1;
          }
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
  }, [clearTooltip, entryWidth, onTooltipValueChange, series, tooltip, xScale]);

  return (
    <div>
      <div className={styles.container} ref={ref}>
        {tooltipValues && tooltipValues?.values && tooltipValues.values[0] && (
          <div
            ref={tooltipRef}
            className={classNames(styles.tooltip, 'GraphTooltip')}
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
                    {format(tooltipValues.values[0].date, dateFormatWithTime, { locale })}
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
                        className={styles.tooltipCell}
                        style={{ color }}
                      >
                        {`${plot.name}:`}
                      </td>
                      <td
                        className={styles.tooltipCell}
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
        <div className={styles.yAxis}>
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
        </div>
        <div className={styles.graphLegendContainer}>
          <div
            className={
              classNames(
                styles.graphContainer,
                { [styles.graphContainerNavigation]: navigation },
                'GraphContainer',
              )
            }
            ref={graphContainerRef}
            onMouseMove={handleMouseOver}
            onMouseLeave={clearTooltip}
            onScroll={clearTooltip}
          >
            {series.map((plot, index) => {
              if (!stacked && index > 0) return null;

              const columnsHeight = stacked && plot.axisHeight ? plot.axisHeight : height;

              return (
                <svg
                  key={`${plot.key}_${stacked ? 'stacked' : 'combined'}`}
                  width={totalWidth}
                  height={heightWithPadding(columnsHeight)}
                  className={styles.graph}
                >
                  <GridRows
                    scale={yScales[index]}
                    width={width}
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
                        // don't render last day
                        if (compareDesc(tick.valueOf(), dates[0]) === 0) return '';

                        const date = tick.valueOf();

                        if (compareDesc(startOfDay(date), date) === 0) {
                          return format(date, dateFormat, { locale });
                        }

                        return format(date, 'p', { locale });
                      }}
                      tickTransform={specificity === 'daily'
                        ? `translate(${dateWidth / 2} 0)`
                        : undefined}
                      hideTicks={specificity === 'daily'}
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
                          barWidth={typeof innerPlot.barWidth !== 'undefined'
                            ? innerPlot.barWidth : entryWidth}
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
                  {tooltipValues && (
                    <LineVisx
                      from={{ x: tooltipValues.x, y: padding }}
                      to={{ x: tooltipValues.x, y: columnsHeight + padding }}
                      stroke="#f00"
                      strokeWidth={1}
                      strokeOpacity={0.8}
                      pointerEvents="none"
                      strokeDasharray="5,5"
                    />
                  )}
                </svg>
              );
            })}
          </div>
          <Legend
            stacked={stacked}
            series={series}
            graphHeight={height}
            heightWithPadding={heightWithPadding}
            translations={{
              missing: t('missing'),
              predicted: t('predicted'),
            }}
          />
        </div>
        {series.length > 1 && (
          <div className={styles.yAxisRight}>
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
    </div>
  );
};

export default Graph;
