import formatNumber from './formatNumber';

function formatObservationValue(value: number | null, locale = 'nb', decimals = 2, enableRoundingZeros = true): string {
  if (value === null) {
    return '';
  }

  const parsedValue = value.toFixed(decimals);

  return formatNumber(enableRoundingZeros ? parseFloat(parsedValue) : parsedValue, locale);
}

export default formatObservationValue;
