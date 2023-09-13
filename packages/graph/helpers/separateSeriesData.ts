import { DataPoint } from '../types';

import { isMissing, isPredicted } from './dataPoint';

function separateSeriesData(data: DataPoint[], condition: (datum: DataPoint) => boolean): DataPoint[][] {
  return data.reduce((acc: DataPoint[][], item) => {
    const lastList = acc[acc.length - 1];
    const lastItem = lastList && lastList[lastList.length - 1];

    const previousMatched = lastItem && condition(lastItem);

    // if previous item matched, but new one doesn't: create new list
    if (previousMatched !== condition(item)) {
      return [...acc, [item]];
    }

    // add item to last list condition didn't change
    const newList = [...acc];
    newList[newList.length - 1] = [...newList[newList.length - 1], item];

    return newList;
  }, []);
}

export function separateSeriesDataOnMissing(data: DataPoint[]): DataPoint[][] {
  return separateSeriesData(data, isMissing);
}

export function separateSeriesDataOnPredicted(data: DataPoint[]): DataPoint[][] {
  return separateSeriesData(data, isPredicted);
}

export function separateSeriesDataOnMissingAndPredicted(data: DataPoint[]): DataPoint[][] {
  // make it so that missing and predicted are in separate lists not touching each other
  const plotData = data.map((p, index) => {
    if (data[index - 1] && isMissing(p) && isPredicted(data[index - 1])) {
      return {
        ...p,
        missing: false,
      };
    }

    return p;
  });

  return separateSeriesData(plotData, (p) => isMissing(p) || isPredicted(p));
}
