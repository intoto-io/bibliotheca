function formatNumber(input: number | string, locale: string): string {
  if (locale === "nb") {
    return input.toString().replace(".", ",");
  }

  return input.toString();
}

export default formatNumber;
