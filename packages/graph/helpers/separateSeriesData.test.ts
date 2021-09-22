import { separateSeriesDataOnMissing, separateSeriesDataOnPredicted } from './separateSeriesData';

describe('separateSeriesData', () => {
  describe('separateSeriesDataOnMissing', () => {
    it('should convert a single series of data into chunks where missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0), missing: true },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [
          { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        ],
        [
          { value: 12, date: new Date(2021, 1, 1, 2, 0, 0), missing: true },
        ],
        [
          { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        ],
      ]);
    });

    it('should convert a single series of data into a single chunks if none missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [
          { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
          { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        ],
      ]);
    });

    it('should work with first item missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0), missing: true },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [
          { value: 10, date: new Date(2021, 1, 1, 0, 0, 0), missing: true },
        ],
        [
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
          { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        ],
      ]);
    });

    it('should work with last item missing', () => {
      const data: DataPoint[] = [
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0), missing: true },
      ];

      expect(separateSeriesDataOnMissing(data)).toEqual([
        [
          { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
          { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        ],
        [
          { value: 11, date: new Date(2021, 1, 1, 3, 0, 0), missing: true },
        ],
      ]);
    });
  });

  describe('separateSeriesDataOnPredicted', () => {
    it('should convert a single series of data into chunks where predicted', () => {
      const data: DataPoint[] = [
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        {
          value: 12,
          date: new Date(2021, 1, 1, 2, 0, 0),
          predicted: true,
          minValue: 10,
          maxValue: 14,
        },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        ],
        [
          {
            value: 12,
            date: new Date(2021, 1, 1, 2, 0, 0),
            predicted: true,
            minValue: 10,
            maxValue: 14,
          },
        ],
        [
          { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        ],
      ]);
    });

    it('should convert a single series of data into a single chunks if none is predicted', () => {
      const data: DataPoint[] = [
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
          { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        ],
      ]);
    });

    it('should work with first item is predicted', () => {
      const data: DataPoint[] = [
        {
          value: 10,
          date: new Date(2021, 1, 1, 0, 0, 0),
          predicted: true,
          minValue: 9,
          maxValue: 12,
        },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          {
            value: 10,
            date: new Date(2021, 1, 1, 0, 0, 0),
            predicted: true,
            minValue: 9,
            maxValue: 12,
          },
        ],
        [
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
          { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 3, 0, 0) },
        ],
      ]);
    });

    it('should work with last item is predicted', () => {
      const data: DataPoint[] = [
        { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
        { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
        { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        {
          value: 11,
          date: new Date(2021, 1, 1, 3, 0, 0),
          predicted: true,
          minValue: 9,
          maxValue: 12,
        },
      ];

      expect(separateSeriesDataOnPredicted(data)).toEqual([
        [
          { value: 10, date: new Date(2021, 1, 1, 0, 0, 0) },
          { value: 11, date: new Date(2021, 1, 1, 1, 0, 0) },
          { value: 12, date: new Date(2021, 1, 1, 2, 0, 0) },
        ],
        [
          {
            value: 11,
            date: new Date(2021, 1, 1, 3, 0, 0),
            predicted: true,
            minValue: 9,
            maxValue: 12,
          },
        ],
      ]);
    });
  });
});
