function formatNumber(input: number | string, locale: string): string {
  if (['nb', 'sv', 'da', 'fi'].includes(locale)) {
    return input.toString().replace('.', ',');
  }

  return input.toString();
}

export default formatNumber;
