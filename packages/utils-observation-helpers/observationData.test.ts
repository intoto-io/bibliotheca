import { observationDataToLineData } from './observationData';

describe('observationData', () => {
  describe('observationDataToLineData', () => {
    it('should convert a normal observation to line data', () => {
      const data = [
        { date: new Date(2021, 9, 11), values: [12, 12, 11, null] },
        { date: new Date(2021, 9, 10), values: [12, 12.5, 11.5, 12] },
        { date: new Date(2021, 9, 9), values: [11, null, 9, 8] },
      ];

      const output = observationDataToLineData(data, new Date(2021, 9, 11, 14, 0, 0));

      expect(output).toEqual([
        {
          date: new Date(2021, 9, 11, 12, 0, 0),
          value: 11,
          missing: false,
        },
        {
          date: new Date(2021, 9, 11, 6, 0, 0),
          value: 12,
          missing: false,
        },
        {
          date: new Date(2021, 9, 11, 0, 0, 0),
          value: 12,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 18, 0, 0),
          value: 12,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 12, 0, 0),
          value: 11.5,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 6, 0, 0),
          value: 12.5,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 0, 0, 0),
          value: 12,
          missing: false,
        },
        {
          date: new Date(2021, 9, 9, 18, 0, 0),
          value: 8,
          missing: false,
        },
        {
          date: new Date(2021, 9, 9, 12, 0, 0),
          value: 9,
          missing: false,
        },
        {
          date: new Date(2021, 9, 9, 6, 0, 0),
          value: 11,
          missing: true,
        },
        {
          date: new Date(2021, 9, 9, 0, 0, 0),
          value: 11,
          missing: false,
        },
      ]);
    });

    it('should convert an observation with min and max to line data with prediction', () => {
      const data = [
        {
          date: new Date(2021, 9, 11),
          values: [12, 12, 11, null],
          min: [null, 9, null, null],
          max: [null, 14, 15, null],
        },
        { date: new Date(2021, 9, 10), values: [12, 12.5, 11.5, 12] },
        { date: new Date(2021, 9, 9), values: [11, null, 9, 8] },
      ];

      const output = observationDataToLineData(data, new Date(2021, 9, 11, 14, 0, 0));

      expect(output).toEqual([
        {
          date: new Date(2021, 9, 11, 12, 0, 0),
          value: 11,
          predicted: true,
          minValue: undefined,
          maxValue: 15,
        },
        {
          date: new Date(2021, 9, 11, 6, 0, 0),
          value: 12,
          predicted: true,
          minValue: 9,
          maxValue: 14,
        },
        {
          date: new Date(2021, 9, 11, 0, 0, 0),
          value: 12,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 18, 0, 0),
          value: 12,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 12, 0, 0),
          value: 11.5,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 6, 0, 0),
          value: 12.5,
          missing: false,
        },
        {
          date: new Date(2021, 9, 10, 0, 0, 0),
          value: 12,
          missing: false,
        },
        {
          date: new Date(2021, 9, 9, 18, 0, 0),
          value: 8,
          missing: false,
        },
        {
          date: new Date(2021, 9, 9, 12, 0, 0),
          value: 9,
          missing: false,
        },
        {
          date: new Date(2021, 9, 9, 6, 0, 0),
          value: 11,
          missing: true,
        },
        {
          date: new Date(2021, 9, 9, 0, 0, 0),
          value: 11,
          missing: false,
        },
      ]);
    });
  });
});
