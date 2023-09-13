import { DataPoint } from '../types';

import { separateSeriesDataOnMissing, separateSeriesDataOnPredicted } from './separateSeriesData';

describe('separateSeriesData', () => {
  describe('separateSeriesDataOnMissing', () => {
    it('should convert a single series of data into chunks where missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [
          { value: 10, date: '2021-02-01T00:00:00.000Z' },
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
        ],
        [{ value: 12, date: '2021-02-01T02:00:00.000Z', missing: true }],
        [{ value: 11, date: '2021-02-01T03:00:00.000Z' }],
      ]);
    });

    it('should convert a single series of data into a single chunks if none missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z' },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [
          { value: 10, date: '2021-02-01T00:00:00.000Z' },
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
          { value: 12, date: '2021-02-01T02:00:00.000Z' },
          { value: 11, date: '2021-02-01T03:00:00.000Z' },
        ],
      ]);
    });

    it('should work with first item missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: '2021-02-01T00:00:00.000Z', missing: true },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z' },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [{ value: 10, date: '2021-02-01T00:00:00.000Z', missing: true }],
        [
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
          { value: 12, date: '2021-02-01T02:00:00.000Z' },
          { value: 11, date: '2021-02-01T03:00:00.000Z' },
        ],
      ]);
    });

    it('should work with last item missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z' },
        { value: 11, date: '2021-02-01T03:00:00.000Z', missing: true },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [
          { value: 10, date: '2021-02-01T00:00:00.000Z' },
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
          { value: 12, date: '2021-02-01T02:00:00.000Z' },
        ],
        [{ value: 11, date: '2021-02-01T03:00:00.000Z', missing: true }],
      ]);
    });
  });

  describe('separateSeriesDataOnPredicted', () => {
    it('should convert a single series of data into chunks where predicted', () => {
      const data: DataPoint[] = [
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        {
          value: 12,
          date: '2021-02-01T02:00:00.000Z',
          predicted: true,
          minValue: 10,
          maxValue: 14,
        },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          { value: 10, date: '2021-02-01T00:00:00.000Z' },
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
        ],
        [
          {
            value: 12,
            date: '2021-02-01T02:00:00.000Z',
            predicted: true,
            minValue: 10,
            maxValue: 14,
          },
        ],
        [{ value: 11, date: '2021-02-01T03:00:00.000Z' }],
      ]);
    });

    it('should convert a single series of data into a single chunks if none is predicted', () => {
      const data: DataPoint[] = [
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z' },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          { value: 10, date: '2021-02-01T00:00:00.000Z' },
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
          { value: 12, date: '2021-02-01T02:00:00.000Z' },
          { value: 11, date: '2021-02-01T03:00:00.000Z' },
        ],
      ]);
    });

    it('should work with first item is predicted', () => {
      const data: DataPoint[] = [
        {
          value: 10,
          date: '2021-02-01T00:00:00.000Z',
          predicted: true,
          minValue: 9,
          maxValue: 12,
        },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z' },
        { value: 11, date: '2021-02-01T03:00:00.000Z' },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          {
            value: 10,
            date: '2021-02-01T00:00:00.000Z',
            predicted: true,
            minValue: 9,
            maxValue: 12,
          },
        ],
        [
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
          { value: 12, date: '2021-02-01T02:00:00.000Z' },
          { value: 11, date: '2021-02-01T03:00:00.000Z' },
        ],
      ]);
    });

    it('should work with last item is predicted', () => {
      const data: DataPoint[] = [
        { value: 10, date: '2021-02-01T00:00:00.000Z' },
        { value: 11, date: '2021-02-01T01:00:00.000Z' },
        { value: 12, date: '2021-02-01T02:00:00.000Z' },
        {
          value: 11,
          date: '2021-02-01T03:00:00.000Z',
          predicted: true,
          minValue: 9,
          maxValue: 12,
        },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          { value: 10, date: '2021-02-01T00:00:00.000Z' },
          { value: 11, date: '2021-02-01T01:00:00.000Z' },
          { value: 12, date: '2021-02-01T02:00:00.000Z' },
        ],
        [
          {
            value: 11,
            date: '2021-02-01T03:00:00.000Z',
            predicted: true,
            minValue: 9,
            maxValue: 12,
          },
        ],
      ]);
    });
  });
});
