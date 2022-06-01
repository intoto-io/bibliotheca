import { FunctionComponent, useEffect, useState } from 'react';

import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { isMissing, isPredicted } from '../helpers/dataPoint';
import hasValueInThreshold from '../helpers/hasValueInThreshold';
import colorByIndex from '../helpers/colorByIndex';
import { DataPoint, GraphSeries } from '../types';

const LegendItem = {
  marginLeft: 1,
  height: 16,
  display: 'flex',
  alignItems: 'center',
};

const LegendColor = {
  height: 0,
  width: 15,
  marginTop: '3px',
  marginBottom: '3px',
  border: 0,
  borderTop: '3px solid #fff',
};

const LegendColors = {
  width: 15,
  marginRight: 0.5,
};

interface LegendProps {
  stacked: boolean;
  series: GraphSeries[];
  meanLevel?: number;
  currentPoint?: DataPoint;
  paddingRight: number;
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
  paddingRight,
  currentPoint,
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

  const updatedAt: Date = currentPoint ? new Date(currentPoint.date) : new Date();

  return (
    <Box
      className="GraphLegend"
      sx={{
        display: 'flex',
        direction: 'ltr',
        alignItems: 'flex-end',
        zIndex: 1,
        transform: 'translateY(-100%)',
        marginTop: '-5px',
        justifyContent: 'flex-end',
        flexDirection: !stacked ? 'row' : 'column',
        paddingRight: `${paddingRight}px`,
      }}
    >
      {currentPoint && (
        <Box
          sx={{
            ...LegendItem,
            marginLeft: 0,
            flexGrow: 1,
            fontStyle: 'italic',
          }}
        >
          <Typography variant="caption">
            {translations.updated_at
              .replace('{time}', formatDistanceToNowStrict(updatedAt, { locale }))}
          </Typography>
        </Box>
      )}
      {typeof meanLevel !== 'undefined' && (
        <Box sx={LegendItem}>
          <Box
            sx={{
              height: 0,
              width: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '5px solid red',
              marginRight: '6px',
              borderLeftColor: meanLevelStrokeColor,
            }}
          />
          <Box sx={{ display: 'flex' }}>
            <Typography variant="caption">
              {translations.meanLevel}
            </Typography>
          </Box>
        </Box>
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
          <Box key={plot.key} sx={{ display: 'flex' }}>
            <Box sx={LegendItem}>
              <Box sx={LegendColors}>
                <Box
                  sx={{
                    ...LegendColor,
                    borderColor: color,
                  }}
                />
                {hasThresholdData && (
                  <Box
                    sx={{
                      ...LegendColor,
                      borderColor: plot.thresholdColor || '#000',
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption">
                {plot.name}
              </Typography>
            </Box>
            {hasMissingData && (
              <Box sx={LegendItem}>
                <Box sx={LegendColors}>
                  <Box
                    sx={{
                      ...LegendColor,
                      opacity: plot.type === 'bar' ? 0.5 : 1,
                      ...(plot.type !== 'bar' ? {
                        borderColor: 'inherit',
                        borderStyle: 'dashed',
                      } : {}),
                      borderColor: color,
                    }}
                  />
                </Box>
                <Typography variant="caption">
                  {translations.missing}
                </Typography>
              </Box>
            )}
            {hasPredictedData && (
              <Box sx={LegendItem}>
                <Box sx={LegendColors}>
                  <Box
                    sx={{
                      ...LegendColor,
                      borderColor: color,
                      opacity: 0.6,
                    }}
                  />
                  {hasThresholdData && (
                    <Box
                      sx={{
                        ...LegendColor,
                        borderColor: plot.thresholdColor || '#000',
                        opacity: 0.6,
                        ...(plot.type === 'line' ? {
                          opacity: 0.5,
                          margin: 0,
                          borderTopWidth: 4.5,
                        } : {}),
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption">
                  {translations.predicted}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Legend;
