import {
  addDays,
  startOfDay,
  subDays,
  subHours,
  subMinutes,
  isAfter,
  addHours,
} from 'date-fns';

import { DataPoint } from '../types';

import { createDataPoint, createMissingDataPoint, createPredictedDataPoint } from './dataPoint';

function randNumber(min = 0, max = 20, decimals = 0): number {
  const outcome = Math.random() * (max - min) + min;
  const factor = decimals !== 0 ? 10 * decimals : 1;

  return Math.floor(outcome * factor) / factor;
}

function rand(input: number, gap = false, min = 0, max = 20, change = 5): number {
  if (gap) return input;

  const changeAmount = randNumber(0, change);
  const coinToss = Math.random();

  if (input - changeAmount < min || (coinToss < 0.5 && input + changeAmount < max)) {
    return input + changeAmount;
  }

  return input - changeAmount;
}

export const generateDays = (
  numberOfDays: number,
  pointsPerDay = 4,
  futureDays = 0,
): Date[] => {
  const dates = [];

  const startingPoint = addDays(startOfDay(new Date()), futureDays);

  for (let i = 0; i < numberOfDays; i += 1) {
    const day = subDays(startingPoint, i);
    dates.push(day);

    if (pointsPerDay > 1) {
      for (let j = 1; j < pointsPerDay; j += 1) {
        dates.push(subHours(day, (24 / pointsPerDay) * j));
      }
    }
  }

  return dates;
};

export const generateMinutes = (numberOfHours: number): Date[] => {
  const dates = [];

  const now = new Date();

  for (let i = 0; i < (numberOfHours * 60); i += 1) {
    const day = subMinutes(now, i);
    dates.push(day);
  }

  return dates;
};

export const randomLineData = (
  dates: Date[],
  gaps = false,
  min = 0,
  max = 20,
  startOffset = 0,
): DataPoint[] => Array.from(
  dates,
  (date): DataPoint => ({
    value: 0,
    date: addHours(date, startOffset),
  }),
).reduce((acc: DataPoint[], item, index) => {
  const predicted = isAfter(item.date, new Date());
  const missing = index !== 0 && gaps ? Math.random() > 0.9 : false;
  const value = index === 0 ? randNumber(min, max) : rand(acc[index - 1].value, missing, min, max);

  if (predicted) {
    return [
      ...acc,
      createPredictedDataPoint({
        ...item,
        value,
        minValue: randNumber(value - 3, value - 1),
        maxValue: randNumber(value + 1, value + 3),
      }),
    ];
  }

  if (missing) {
    return [
      ...acc,
      createMissingDataPoint({ ...item, value }),
    ];
  }

  return [
    ...acc,
    createDataPoint({ ...item, value }),
  ];
}, []);
