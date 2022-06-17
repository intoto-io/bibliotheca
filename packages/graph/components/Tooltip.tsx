import { RefObject } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { defaultStyles } from '@visx/tooltip';

import { GraphSeries, TooltipValues } from '../types';
import { valueInThreshold } from '../helpers/hasValueInThreshold';
import colorByIndex from '../helpers/colorByIndex';
import { isMissing } from '../helpers';
import { tickFormat, changeFormat } from '../helpers/formatValues';

interface TooltipProps {
  tooltipRef: RefObject<HTMLDivElement>;
  tooltipValues: TooltipValues | undefined;
  locale: Locale;
  series: GraphSeries[];
  missingText: string;
  change1hText: string;
  change24hText: string;
}

function Tooltip({
  tooltipRef,
  tooltipValues,
  locale,
  series,
  missingText,
  change1hText,
  change24hText,
}: TooltipProps) {
  if (!tooltipValues || !tooltipValues?.values || !tooltipValues.values[0]) {
    return null;
  }

  return (
    <Box
      ref={tooltipRef}
      className="GraphTooltip"
      sx={{
        ...defaultStyles,
        position: 'absolute',
        transform: 'translateY(-50%)',
        zIndex: 10,
        px: 2,
        py: 1.5,
      }}
      style={{
        top: tooltipValues.ty,
        left: tooltipValues.tx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
        }}
      >
        {series.map((plot, index) => {
          const point = tooltipValues.values[index];
          const color = typeof plot.threshold !== 'undefined' && valueInThreshold(
            tooltipValues.values[index].value,
            plot.threshold,
            plot.thresholdDirection,
          ) ? plot.thresholdColor : plot.color || colorByIndex(index);

          if (!point) {
            return null;
          }

          return (
            <Box
              key={plot.key}
              sx={{
                whiteSpace: 'nowrap',
                margin: '0 8px',
                '&:first-of-type': {
                  marginLeft: 0,
                },
                '&:last-child': {
                  marginRight: 0,
                },
              }}
            >
              <Typography variant="subtitle2">
                {`${plot.name}`}
              </Typography>
              <Box
                sx={{
                  color,
                  marginTop: '6px',
                  fontSize: isMissing(point) ? undefined : '1.5rem',
                  lineHeight: '1.3rem',
                }}
              >
                {isMissing(point)
                  ? missingText
                  : tickFormat(plot, point.value)}
              </Box>
              {point.change && Object.values(point.change).length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Water level change
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        {`${change1hText} ${changeFormat(plot, point.change['1h'])}`}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        {`${change24hText} ${changeFormat(plot, point.change['24h'])}`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      <Box sx={{ marginTop: '12px' }}>
        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
          {format(new Date(tooltipValues.values[0].date), 'Pp', { locale })}
        </Typography>
      </Box>
    </Box>
  );
}

export default Tooltip;
