import { DataPoint } from '../types';

import { sortSeriesDataByDateAsc, sortSeriesDataByDateDesc } from './sortSeriesData';

describe('sortSeriesData', () => {
  const data: DataPoint[] = [
    { value: 11, date: '2021-02-01T03:00:00.000Z' },
    { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
    { value: 10, date: '2021-02-01T00:00:00.000Z' },
    { value: 11, date: '2021-02-01T01:00:00.000Z' },
  ];

  describe('sortSeriesDataAsc', () => {
    it('should sort data from old to new', () => {
      expect(sortSeriesDataByDateAsc(data)).toEqual([
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ]);
    });

    it('should leave correct sorting intact', () => {
      const sortedData = [
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ];

      expect(sortSeriesDataByDateAsc(sortedData)).toEqual([
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ]);
    });
  });

  describe('sortSeriesDataDesc', () => {
    it('should sort data from new to old', () => {
      expect(sortSeriesDataByDateDesc(data)).toEqual([
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
      ]);
    });

    it('should leave correct sorting intact', () => {
      const sortedData = [
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
      ];

      expect(sortSeriesDataByDateDesc(sortedData)).toEqual([
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
      ]);
    });
  });
});
