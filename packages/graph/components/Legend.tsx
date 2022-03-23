import { FunctionComponent, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';

import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

import { isMissing, isPredicted } from '../helpers/dataPoint';
import hasValueInThreshold from '../helpers/hasValueInThreshold';
import colorByIndex from '../helpers/colorByIndex';
import { GraphSeries } from '../types';

const PREFIX = 'Legend';

const classes = {
  legend: `${PREFIX}-legend`,
  legendItem: `${PREFIX}-legendItem`,
  legendColors: `${PREFIX}-legendColors`,
  legendColor: `${PREFIX}-legendColor`,
  legendMeanLevel: `${PREFIX}-legendMeanLevel`,
  legendColorDashed: `${PREFIX}-legendColorDashed`,
  legendColorBar: `${PREFIX}-legendColorBar`,
  legendWrap: `${PREFIX}-legendWrap`,
  legendPrediction: `${PREFIX}-legendPrediction`,
  legendPredictionLine: `${PREFIX}-legendPredictionLine`,
  legendItemUpdated: `${PREFIX}-legendItemUpdated`,
};

const Root = styled('div')({
  [`&.${classes.legend}`]: {
    display: 'flex',
    direction: 'ltr',
    fontSize: '0.75em',
    alignItems: 'flex-end',
    zIndex: 1,
    transform: 'translateY(-100%)',
    marginTop: '-5px',
    justifyContent: 'flex-end',
  },
  [`& .${classes.legendItem}`]: {
    marginLeft: 8,
    height: 16,
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.legendItemUpdated}`]: {
    marginLeft: 0,
    flexGrow: 1,
    fontStyle: 'italic',
  },
  [`& .${classes.legendColors}`]: {
    width: 15,
    marginRight: 4,
  },
  [`& .${classes.legendColor}`]: {
    height: 0,
    width: 15,
    marginTop: 3,
    marginBottom: 3,
    border: 0,
    borderTop: '3px solid #fff',
  },
  [`& .${classes.legendMeanLevel}`]: {
    height: 0,
    width: 0,
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: '5px solid red',
    marginRight: 5,
  },
  [`& .${classes.legendColorDashed}`]: {
    borderColor: 'inherit',
    borderStyle: 'dashed',
  },
  [`& .${classes.legendColorBar}`]: {
    opacity: 0.5,
  },
  [`& .${classes.legendWrap}`]: {
    display: 'flex',
  },
  [`& .${classes.legendPrediction}`]: {
    opacity: 0.6,
  },
  [`& .${classes.legendPredictionLine}`]: {
    opacity: 0.5,
    margin: 0,
    borderTopWidth: 4.5,
  },
});

interface LegendProps {
  stacked: boolean;
  series: GraphSeries[];
  meanLevel?: number;
  showCurrent: boolean;
  padding: number;
  meanLevelStrokeColor: string;
  locale: Locale;
  translations: {
    updated_at: string;
    missing: string;
    predicted: string;
    meanLevel: string;
  };
}

const Legend: FunctionComponent<LegendProps> = function Legend({
  stacked,
  series,
  meanLevel,
  meanLevelStrokeColor,
  translations,
  locale,
  padding,
  showCurrent,
}) {
  const showLegend = series.every((plot) => !!plot.name);
  const [, setTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(+new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showLegend) {
    return null;
  }

  const updatedAt: Date = new Date(series[0].data[0].date);

  return (
    <Root
      className={classNames(classes.legend, 'GraphLegend')}
      style={{ flexDirection: !stacked ? 'row' : 'column', paddingRight: padding }}
    >
      {showCurrent && (
        <div className={classNames(classes.legendItem, classes.legendItemUpdated)}>
          {translations.updated_at
            .replace('{time}', formatDistanceToNowStrict(updatedAt, { locale }))}
        </div>
      )}
      {typeof meanLevel !== 'undefined' && (
        <div className={classes.legendItem}>
          <div
            className={classes.legendMeanLevel}
            style={{ borderLeftColor: meanLevelStrokeColor }}
          />
          <div className={classes.legendWrap}>
            <div>{translations.meanLevel}</div>
          </div>
        </div>
      )}
      {series.map((plot, index) => {
        const hasThresholdData = hasValueInThreshold(
          plot.data,
          plot.threshold,
          plot.thresholdDirection,
        );
        const hasMissingData = plot.data.some(isMissing);
        const hasPredictedData = plot.data.some(isPredicted);

        const color = plot.color || colorByIndex(index);

        return (
          <div key={plot.key} className={classes.legendWrap}>
            <div className={classes.legendItem}>
              <div className={classes.legendColors}>
                <div className={classes.legendColor} style={{ borderColor: color }} />
                {hasThresholdData && (
                  <div
                    className={classes.legendColor}
                    style={{ borderColor: plot.thresholdColor || '#000' }}
                  />
                )}
              </div>
              <div>
                {plot.name}
              </div>
            </div>
            {hasMissingData && (
              <div className={classes.legendItem}>
                <div className={classes.legendColors}>
                  <div
                    style={{ borderColor: color }}
                    className={
                      classNames(
                        classes.legendColor,
                        {
                          [classes.legendColorDashed]: plot.type !== 'bar',
                          [classes.legendColorBar]: plot.type === 'bar',
                        },
                      )
                    }
                  />
                </div>
                <div>{translations.missing}</div>
              </div>
            )}
            {hasPredictedData && (
              <div className={classes.legendItem}>
                <div className={classes.legendColors}>
                  <div
                    style={{ borderColor: color }}
                    className={classNames(classes.legendColor, classes.legendPrediction)}
                  />
                  {hasThresholdData && (
                    <div
                      className={classNames(
                        classes.legendColor,
                        classes.legendPrediction,
                        {
                          [classes.legendPredictionLine]: plot.type === 'line',
                        },
                      )}
                      style={{ borderColor: plot.thresholdColor || '#000' }}
                    />
                  )}
                </div>
                <div>{translations.predicted}</div>
              </div>
            )}
          </div>
        );
      })}
    </Root>
  );
};

export default Legend;
