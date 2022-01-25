import { FunctionComponent } from 'react';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';

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
  legendColorDashed: `${PREFIX}-legendColorDashed`,
  legendColorBar: `${PREFIX}-legendColorBar`,
  legendWrap: `${PREFIX}-legendWrap`,
  legendPrediction: `${PREFIX}-legendPrediction`,
  legendPredictionLine: `${PREFIX}-legendPredictionLine`,
};

const Root = styled('div')({
  [`&.${classes.legend}`]: {
    display: 'flex',
    position: 'absolute',
    direction: 'ltr',
    fontSize: '0.75em',
    right: 30,
    top: -5,
    alignItems: 'flex-end',
    zIndex: 1,
  },
  [`& .${classes.legendItem}`]: {
    marginLeft: 8,
    height: 16,
    display: 'flex',
    alignItems: 'center',
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
  graphHeight: number;
  heightWithPadding(height: number): number;
  translations: {
    missing: string;
    predicted: string;
  };
}

const Legend: FunctionComponent<LegendProps> = function Legend({
  stacked,
  series,
  graphHeight,
  heightWithPadding,
  translations,
}) {
  const showLegend = series.every((plot) => !!plot.name);

  if (!showLegend) {
    return null;
  }

  return (
    <Root
      className={classNames(classes.legend, 'GraphLegend')}
      style={{ flexDirection: !stacked ? 'row' : 'column' }}
    >
      {series.map((plot, index) => {
        const plotHeight = stacked && plot.axisHeight
          ? heightWithPadding(plot.axisHeight) - 16
          : heightWithPadding(graphHeight) - 16;
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
            <div
              className={classes.legendItem}
              style={{ marginTop: plotHeight }}
            >
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
              <div
                className={classes.legendItem}
                style={{ marginTop: plotHeight }}
              >
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
              <div
                className={classes.legendItem}
                style={{ marginTop: plotHeight }}
              >
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
