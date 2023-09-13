import { DataPoint } from "../types";

import hasValueInThreshold, { valueInThreshold } from "./hasValueInThreshold";

describe("valueInThreshold", () => {
  it("should correctly check default direction", () => {
    expect(valueInThreshold(10, 5)).toBeTruthy();
    expect(valueInThreshold(2, 5)).toBeFalsy();
    expect(valueInThreshold(5, 5)).toBeFalsy();
  });

  it("should correctly check down direction", () => {
    expect(valueInThreshold(10, 5, "down")).toBeFalsy();
    expect(valueInThreshold(2, 5, "down")).toBeTruthy();
    expect(valueInThreshold(5, 5, "down")).toBeFalsy();
  });
});

describe("hasValueInThreshold", () => {
  const points: DataPoint[] = [
    { value: 5, date: "2021-02-01T00:00:00.000Z" },
    { value: 6, date: "2021-02-01T01:00:00.000Z" },
    { value: 9, date: "2021-02-01T02:00:00.000Z" },
    { value: 6, date: "2021-02-01T03:00:00.000Z" },
  ];

  it("should check data points for threshold", () => {
    expect(hasValueInThreshold(points, 10)).toBeFalsy();
    expect(hasValueInThreshold(points, 9)).toBeFalsy();
    expect(hasValueInThreshold(points, 8)).toBeTruthy();
    expect(hasValueInThreshold(points, 4)).toBeTruthy();
  });

  it("should check data points for threshold in other direction", () => {
    expect(hasValueInThreshold(points, 5, "down")).toBeFalsy();
    expect(hasValueInThreshold(points, 0, "down")).toBeFalsy();
    expect(hasValueInThreshold(points, 6, "down")).toBeTruthy();
    expect(hasValueInThreshold(points, 10, "down")).toBeTruthy();
  });

  it("should default to false on no threshold", () => {
    expect(hasValueInThreshold(points)).toBeFalsy();
  });
});
