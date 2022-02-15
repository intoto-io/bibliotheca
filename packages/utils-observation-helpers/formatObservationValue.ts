import formatNumber from './formatNumber';

function formatObservationValue(value: number | null, locale = 'nb', decimals = 2): string {
  if (value === null) {
    return '';
  }

  return formatNumber(parseFloat(value.toFixed(decimals)), locale);
}

export default formatObservationValue;
