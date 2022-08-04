import { createElement, RefObject } from 'react';
import { format } from 'date-fns';

import TooltipLib from '@intoto-dev/bibliotheca-location-tooltip';

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

  const values = series
    .filter((plot, index) => {
      const point = tooltipValues.values[index];
      return !!point;
    })
    .map((plot, index) => {
      const point = tooltipValues.values[index];
      const color = typeof plot.threshold !== 'undefined' && valueInThreshold(
        tooltipValues.values[index].value,
        plot.threshold,
        plot.thresholdDirection,
      ) ? plot.thresholdColor : plot.color || colorByIndex(index);

      return {
        name: plot.name || '',
        value: isMissing(point)
          ? missingText
          : tickFormat(plot, point.value),
        color,
        isSmall: isMissing(point),
        extraContent: plot.tooltipExtra && createElement(plot.tooltipExtra, { point }),
      };
    });

  return (
    <TooltipLib
      tooltipRef={tooltipRef}
      position={{ x: tooltipValues.tx, y: tooltipValues.ty }}
      values={values}
      bottomText={format(new Date(tooltipValues.values[0].date), 'Pp', { locale })}
    />
  );
}

export default Tooltip;
