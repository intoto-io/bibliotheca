import { compareAsc, compareDesc } from "date-fns";

import { DataPoint } from "../types";

function sortSeriesDataByDate(data: DataPoint[], direction: "asc" | "desc"): DataPoint[] {
  return data.sort((a, b) => (direction === "asc" ? compareAsc : compareDesc)(new Date(a.date), new Date(b.date)));
}

export const sortSeriesDataByDateAsc = (data: DataPoint[]): DataPoint[] => sortSeriesDataByDate(data, "asc");

export const sortSeriesDataByDateDesc = (data: DataPoint[]): DataPoint[] => sortSeriesDataByDate(data, "desc");
