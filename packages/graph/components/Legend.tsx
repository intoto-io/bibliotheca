import { FunctionComponent } from 'react';
import classNames from 'classnames';

import makeStyles from '@mui/styles/makeStyles';

import { isMissing, isPredicted } from '../helpers/dataPoint';
import hasValueInThreshold from '../helpers/hasValueInThreshold';
import colorByIndex from '../helpers/colorByIndex';
import { GraphSeries } from '../types';

const useStyles = makeStyles(({
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
  legendItem: {
    marginLeft: 8,
    height: 16,
    display: 'flex',
    alignItems: 'center',
  },
  legendColors: {
    width: 15,
    marginRight: 4,
  },
  legendColor: {
    height: 0,
    width: 15,
    marginTop: 3,
    marginBottom: 3,
    borderTop: '3px solid #fff',
  },
  legendColorDashed: {
    borderColor: 'inherit',
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  legendColorBar: {
    opacity: 0.5,
  },
  legendWrap: {
    display: 'flex',
  },
  legendPrediction: {
    opacity: 0.6,
  },
  legendPredictionLine: {
    opacity: 0.5,
    margin: 0,
    borderTopWidth: 4.5,
  },
}));

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
  const styles = useStyles();

  const showLegend = series.every((plot) => !!plot.name);

  if (!showLegend) {
    return null;
  }

  return (
    <div
      className={classNames(styles.legend, 'GraphLegend')}
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
          <div key={plot.key} className={styles.legendWrap}>
            <div
              className={styles.legendItem}
              style={{ marginTop: plotHeight }}
            >
              <div className={styles.legendColors}>
                <div className={styles.legendColor} style={{ borderColor: color }} />
                {hasThresholdData && (
                  <div
                    className={styles.legendColor}
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
                className={styles.legendItem}
                style={{ marginTop: plotHeight }}
              >
                <div className={styles.legendColors}>
                  <div
                    style={{ borderColor: color }}
                    className={
                      classNames(
                        styles.legendColor,
                        {
                          [styles.legendColorDashed]: plot.type !== 'bar',
                          [styles.legendColorBar]: plot.type === 'bar',
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
                className={styles.legendItem}
                style={{ marginTop: plotHeight }}
              >
                <div className={styles.legendColors}>
                  <div
                    style={{ borderColor: color }}
                    className={classNames(styles.legendColor, styles.legendPrediction)}
                  />
                  {hasThresholdData && (
                    <div
                      className={classNames(
                        styles.legendColor,
                        styles.legendPrediction,
                        {
                          [styles.legendPredictionLine]: plot.type === 'line',
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
    </div>
  );
};

export default Legend;
