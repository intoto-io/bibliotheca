import { getTimezoneOffset, shiftSeriesDates } from "./dateShift";
import { GraphSeries } from "../types";

describe("dateShift", () => {
  describe("getTimezoneOffset", () => {
    it("Should return 0 on UTC", () => {
      expect(getTimezoneOffset("2021-01-01T00:00:00.000Z")).toEqual(0);
    });

    it("Should return 0 on UTC different format", () => {
      expect(getTimezoneOffset("2021-01-01T00:00:00.000+00:00")).toEqual(0);
    });

    it("Should return -120 on UTC+02:00", () => {
      expect(getTimezoneOffset("2021-01-01T00:00:00.000+02:00")).toEqual(-120);
    });

    it("Should return 120 on UTC-02:00", () => {
      expect(getTimezoneOffset("2021-01-01T00:00:00.000-02:00")).toEqual(120);
    });

    it("Should return 120 on UTC+08:00", () => {
      expect(getTimezoneOffset("2021-04-21T22:00:00.000+08:00")).toEqual(-480);
    });
  });

  describe("shiftSeriesDates", () => {
    it("Should shift UTC dates to TZ", () => {
      const series: GraphSeries[] = [
        {
          key: "UTC",
          data: [
            { value: 10, date: "2021-02-01T00:00:00.000Z" },
            { value: 11, date: "2021-02-01T01:00:00.000Z" },
            { value: 12, date: "2021-02-01T02:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-01T03:00:00.000Z" },
          ],
        },
        {
          key: "UTC two",
          data: [
            { value: 10, date: "2021-02-02T00:00:00.000Z" },
            { value: 11, date: "2021-02-02T01:00:00.000Z" },
            { value: 12, date: "2021-02-02T02:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-02T03:00:00.000Z" },
          ],
        },
      ];

      expect(shiftSeriesDates(series)).toEqual([
        {
          key: "UTC",
          data: [
            { value: 10, date: "2021-01-31T23:00:00.000Z" },
            { value: 11, date: "2021-02-01T00:00:00.000Z" },
            { value: 12, date: "2021-02-01T01:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-01T02:00:00.000Z" },
          ],
        },
        {
          key: "UTC two",
          data: [
            { value: 10, date: "2021-02-01T23:00:00.000Z" },
            { value: 11, date: "2021-02-02T00:00:00.000Z" },
            { value: 12, date: "2021-02-02T01:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-02T02:00:00.000Z" },
          ],
        },
      ]);
    });

    it("Should shift UTC+02:00 time to Europe/Amsterdam", () => {
      const series: GraphSeries[] = [
        {
          key: "UTC+02:00",
          data: [
            { value: 10, date: "2021-02-01T00:00:00.000+02:00" },
            { value: 11, date: "2021-02-01T01:00:00.000+02:00" },
            { value: 12, date: "2021-02-01T02:00:00.000+02:00", missing: true },
            { value: 11, date: "2021-02-01T03:00:00.000+02:00" },
          ],
        },
        {
          key: "UTC+02:00 two",
          data: [
            { value: 10, date: "2021-02-02T00:00:00.000+02:00" },
            { value: 11, date: "2021-02-02T01:00:00.000+02:00" },
            { value: 12, date: "2021-02-02T02:00:00.000+02:00", missing: true },
            { value: 11, date: "2021-02-02T03:00:00.000+02:00" },
          ],
        },
      ];

      expect(shiftSeriesDates(series)).toEqual([
        {
          key: "UTC+02:00",
          data: [
            { value: 10, date: "2021-01-31T23:00:00.000Z" },
            { value: 11, date: "2021-02-01T00:00:00.000Z" },
            { value: 12, date: "2021-02-01T01:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-01T02:00:00.000Z" },
          ],
        },
        {
          key: "UTC+02:00 two",
          data: [
            { value: 10, date: "2021-02-01T23:00:00.000Z" },
            { value: 11, date: "2021-02-02T00:00:00.000Z" },
            { value: 12, date: "2021-02-02T01:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-02T02:00:00.000Z" },
          ],
        },
      ]);
    });

    it("Should shift UTC-02:00 dates to Europe/Amsterdam", () => {
      const series: GraphSeries[] = [
        {
          key: "UTC-02:00",
          data: [
            { value: 10, date: "2021-02-01T00:00:00.000-02:00" },
            { value: 11, date: "2021-02-01T01:00:00.000-02:00" },
            { value: 12, date: "2021-02-01T02:00:00.000-02:00", missing: true },
            { value: 11, date: "2021-02-01T03:00:00.000-02:00" },
          ],
        },
        {
          key: "UTC-02:00 two",
          data: [
            { value: 10, date: "2021-02-02T00:00:00.000-02:00" },
            { value: 11, date: "2021-02-02T01:00:00.000-02:00" },
            { value: 12, date: "2021-02-02T02:00:00.000-02:00", missing: true },
            { value: 11, date: "2021-02-02T03:00:00.000-02:00" },
          ],
        },
      ];

      expect(shiftSeriesDates(series)).toEqual([
        {
          key: "UTC-02:00",
          data: [
            { value: 10, date: "2021-01-31T23:00:00.000Z" },
            { value: 11, date: "2021-02-01T00:00:00.000Z" },
            { value: 12, date: "2021-02-01T01:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-01T02:00:00.000Z" },
          ],
        },
        {
          key: "UTC-02:00 two",
          data: [
            { value: 10, date: "2021-02-01T23:00:00.000Z" },
            { value: 11, date: "2021-02-02T00:00:00.000Z" },
            { value: 12, date: "2021-02-02T01:00:00.000Z", missing: true },
            { value: 11, date: "2021-02-02T02:00:00.000Z" },
          ],
        },
      ]);
    });
  });
});
