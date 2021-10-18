import {
  isMissing,
  isPredicted,
  createYScale,
  createXScale,
} from './helpers';
import Graph from './Graph';
import { DataPoint, GraphSeries } from './types';
import useDimensions from './hooks/useDimensions';
import useSeriesFacts from './hooks/useSeriesFacts';

export {
  // main
  Graph,

  // helpers
  isMissing,
  isPredicted,
  createYScale,
  createXScale,

  // hooks
  useDimensions,
  useSeriesFacts,
};

export type {
  DataPoint,
  GraphSeries,
};
