import { sortSeriesDataByDateAsc, sortSeriesDataByDateDesc } from './sortSeriesData';

describe('sortSeriesData', () => {
  const data: DataPoint[] = [
    { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
    { value: 12, date: new Date(2021, 1, 1, 2, 0, 0), missing: true },
    { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
    { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
  ];

  describe('sortSeriesDataAsc', () => {
    it('should sort data from old to new', () => {
      expect(sortSeriesDataByDateAsc(data)).toEqual([
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0), missing: true },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ]);
    });

    it('should leave correct sorting intact', () => {
      expect(sortSeriesDataByDateAsc(data)).toEqual([
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0), missing: true },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ]);
    });
  });

  describe('sortSeriesDataDesc', () => {
    it('should sort data from new to old', () => {
      expect(sortSeriesDataByDateDesc(data)).toEqual([
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0), missing: true },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
      ]);
    });

    it('should leave correct sorting intact', () => {
      expect(sortSeriesDataByDateDesc(data)).toEqual([
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0), missing: true },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
      ]);
    });
  });
});
