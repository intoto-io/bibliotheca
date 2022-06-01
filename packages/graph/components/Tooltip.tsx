import { RefObject } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';

import { defaultStyles } from '@visx/tooltip';

import { GraphSeries, TooltipValues } from '../types';
import { valueInThreshold } from '../helpers/hasValueInThreshold';
import colorByIndex from '../helpers/colorByIndex';
import { isMissing } from '../helpers';
import tickFormat from '../helpers/tickFormat';

interface TooltipProps {
  tooltipRef: RefObject<HTMLDivElement>;
  tooltipValues: TooltipValues | undefined;
  locale: Locale;
  series: GraphSeries[];
  missingText: string;
}

function Tooltip({
  tooltipRef,
  tooltipValues,
  locale,
  series,
  missingText,
}: TooltipProps) {
  if (!tooltipValues || !tooltipValues?.values || !tooltipValues.values[0]) {
    return null;
  }

  return (
    <Box
      ref={tooltipRef}
      className="GraphTooltip"
      sx={{
        position: 'absolute',
        transform: 'translateY(-50%)',
        fontSize: '0.6em',
        zIndex: 10,
      }}
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
              {format(new Date(tooltipValues.values[0].date), 'Pp', { locale })}
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
                <Box
                  component="td"
                  sx={{
                    whiteSpace: 'nowrap',
                    color,
                  }}
                >
                  {`${plot.name}:`}
                </Box>
                <Box
                  component="td"
                  sx={{
                    whiteSpace: 'nowrap',
                    color,
                  }}
                >
                  {isMissing(tooltipValues.values[index])
                    ? missingText
                    : tickFormat(plot, tooltipValues.values[index].value)}
                </Box>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
}

export default Tooltip;
