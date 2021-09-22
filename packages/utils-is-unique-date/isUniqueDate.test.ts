import isUniqueDate from './isUniqueDate';

describe('isUniqueDate', () => {
  it('should find date in list of dates to compare', () => {
    const first = new Date(2021, 4, 20);
    const second = new Date(2021, 4, 21);
    const third = new Date(2021, 4, 22);

    expect(isUniqueDate(first, [first, second, third])).toBe(false);
  });

  it('should not find date in list of dates to compare', () => {
    const first = new Date(2021, 4, 20);
    const second = new Date(2021, 4, 21);
    const third = new Date(2021, 4, 22);

    expect(isUniqueDate(first, [second, third])).toBe(true);
  });

  it('should not match when nothing to compare', () => {
    const first = new Date(2021, 4, 20);

    expect(isUniqueDate(first, [])).toBe(true);
  });
});
