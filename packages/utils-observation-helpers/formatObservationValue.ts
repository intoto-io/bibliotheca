import formatNumber from './formatNumber';

function formatObservationValue(value: number | null, locale = 'nb', decimals = 2): string {
  if (value === null) {
    return '';
  }

  const parsedValue = value.toFixed(decimals);

  return formatNumber(
    parsedValue.match(/\.0$/) ? parseFloat(parsedValue) : parsedValue,
    locale,
  );
}

export default formatObservationValue;
