import { Story, Meta } from '@storybook/react/types-6-0';
import { parseJSON } from 'date-fns';

import Graph, { GraphProps } from './Graph';
import { generateDays, generateMinutes, randomLineData } from './helpers/createData';

import singleLineData from './mocks/singleLine.json';
import sixtyDayHourly from './mocks/sixtyDayHourly.json';
import extremeJumps from './mocks/extremeJumps.json';
import { DataPoint, GraphSeries, SeriesType } from './types';

const dates = generateDays(14);
const lineWithGapsData = randomLineData(dates, true);

const barType: SeriesType = 'bar';

export default {
  title: 'Components/Graph',
  component: Graph,
} as Meta;

const Template: Story<GraphProps> = (args) => (
  <Graph
    {...args}
    t={(key: string) => (key === 'missing' ? 'Missing data' : 'Prediction')}
  />
);

function parseJSONData(data: { date: string }[]) {
  return data.map((d): DataPoint => ({
    ...d,
    date: parseJSON(d.date),
  } as DataPoint));
}

const singleLine: GraphSeries[] = [{
  key: 'singleLine',
  name: 'Single Line',
  data: parseJSONData(singleLineData),
}];

export const Default = Template.bind({});

Default.args = {
  series: singleLine,
};

export const SingleLineCustomHeight = Template.bind({});

SingleLineCustomHeight.args = {
  series: singleLine,
  height: 400,
};

export const SingleLineCustomDateWidth = Template.bind({});

SingleLineCustomDateWidth.args = {
  series: singleLine,
  entryWidth: 30,
};

const singleLineWithGaps = [{
  key: 'singleLineWithGaps',
  data: lineWithGapsData,
}];

export const SingleLineWithGaps = Template.bind({});

SingleLineWithGaps.args = {
  series: singleLineWithGaps,
};

const twoLines: GraphSeries[] = [
  {
    key: 'lineOne',
    data: lineWithGapsData,
  },
  {
    key: 'lineTwo',
    data: randomLineData(dates, true),
  },
];

export const TwoLines = Template.bind({});

TwoLines.args = {
  series: twoLines,
};

const twoLinesCustomColors: GraphSeries[] = [
  {
    key: 'lineOne',
    color: '#000',
    data: randomLineData(dates, true),
  },
  {
    key: 'lineTwo',
    color: 'hotpink',
    data: randomLineData(dates, true),
  },
];

export const TwoLinesCustomColors = Template.bind({});

TwoLinesCustomColors.args = {
  series: twoLinesCustomColors,
};

const oneLineThresholdColors: GraphSeries[] = [
  {
    key: 'lineOneThreshold',
    name: 'Temperature',
    data: randomLineData(dates, true, -10, 10),
    unit: '°C',
    labelWidth: 46,
    threshold: 0,
    thresholdColor: '#00f',
    thresholdDirection: 'down',
  },
];

export const OneLineThresholdColors = Template.bind({});

OneLineThresholdColors.args = {
  series: oneLineThresholdColors,
  tooltip: true,
};

const oneLineStartOffset: GraphSeries[] = [
  {
    key: 'lineOneThreshold',
    name: 'Temperature',
    data: randomLineData(dates, true, -10, 10, 3),
    unit: '°C',
    labelWidth: 46,
  },
];

export const OneLineStartOffset = Template.bind({});

OneLineStartOffset.args = {
  series: oneLineStartOffset,
  tooltip: true,
};

const oneLineOneBarThresholdColors: GraphSeries[] = [
  {
    key: 'lineOne',
    name: 'Temperature',
    data: randomLineData(dates, true, -10, 10),
    unit: '°C',
    labelWidth: 46,
    threshold: 0,
    thresholdColor: '#00f',
    thresholdDirection: 'down',
  },
  {
    key: 'wind',
    name: 'Wind',
    type: 'bar',
    color: '#0a0',
    unit: ' m/s',
    labelWidth: 46,
    thresholdColor: '#00ab9d',
    threshold: 5,
    data: randomLineData(dates, true, 0, 10),
  },
];

export const OneLineOneBarThresholdColors = Template.bind({});

OneLineOneBarThresholdColors.args = {
  series: oneLineOneBarThresholdColors,
  tooltip: true,
};

const threeLinesWithLabels: GraphSeries[] = [
  {
    key: 'temperature',
    name: 'Temperature',
    unit: '°C',
    labelWidth: 46,
    data: randomLineData(dates, false, -10, 15),
  },
  {
    key: 'wind',
    name: 'Wind',
    unit: ' m/s',
    labelWidth: 46,
    data: randomLineData(dates, false, 0, 10),
  },
  {
    key: 'moose',
    name: 'Moose around',
    data: randomLineData(dates, false, 0, 100),
  },
];

export const ThreeLinesWithLabels = Template.bind({});

ThreeLinesWithLabels.args = {
  series: threeLinesWithLabels,
};

const twoLinesWithLabels: GraphSeries[] = [
  {
    key: 'temperature',
    name: 'Temperature',
    unit: '°C',
    labelWidth: 46,
    data: randomLineData(dates, true, -10, 15),
  },
  {
    key: 'wind',
    name: 'Wind',
    unit: ' m/s',
    labelWidth: 46,
    data: randomLineData(dates, true, 0, 10),
  },
];

export const TwoLinesWithLabelsAndTooltip = Template.bind({});

TwoLinesWithLabelsAndTooltip.args = {
  tooltip: true,
  series: twoLinesWithLabels,
};

export const TwoLinesStacked = Template.bind({});

TwoLinesStacked.args = {
  stacked: true,
  series: twoLines,
};

export const TwoLinesWithLabelsAndTooltipsStacked = Template.bind({});

TwoLinesWithLabelsAndTooltipsStacked.args = {
  tooltip: true,
  stacked: true,
  series: twoLinesWithLabels,
};

const oneLineOneBarWithLabels: GraphSeries[] = [
  {
    key: 'temperature',
    name: 'Temperature',
    unit: '°C',
    labelWidth: 46,
    formatValue: (value: number) => value.toFixed(2),
    data: randomLineData(dates, false, -10, 15),
  },
  {
    key: 'precipitation',
    name: 'Precipitation',
    type: barType,
    unit: ' mm',
    labelWidth: 46,
    axisHeight: 60,
    data: randomLineData(dates, true, 0, 10),
  },
];

export const OneLineOneBarLabelsAndTooltip = Template.bind({});

OneLineOneBarLabelsAndTooltip.args = {
  tooltip: true,
  series: oneLineOneBarWithLabels,
};

export const OneLineOneBarStacked = Template.bind({});

OneLineOneBarStacked.args = {
  tooltip: true,
  stacked: true,
  series: oneLineOneBarWithLabels,
};

const hourlyThreeDays = generateDays(3, 24);

const singleLineHourly: GraphSeries[] = [{
  key: 'singleLineHourly',
  name: 'Temperature',
  unit: '°C',
  labelWidth: 46,
  data: randomLineData(hourlyThreeDays),
}];

export const SingleLineHourly = Template.bind({});

SingleLineHourly.args = {
  series: singleLineHourly,
  tooltip: true,
  specificity: 'hourly',
};

const minutelyOneDay = generateMinutes(3);

const singleLineMinutely: GraphSeries[] = [{
  key: 'singleLineMinutely',
  name: 'Temperature',
  unit: '°C',
  labelWidth: 46,
  data: randomLineData(minutelyOneDay),
}];

export const SingleLineMinutely = Template.bind({});

SingleLineMinutely.args = {
  series: singleLineMinutely,
  tooltip: true,
  specificity: 'minutely',
};

const twoWeekAndFuture = generateDays(14, 4, 4);

const singleLineFuture: GraphSeries[] = [{
  key: 'singleLineFuture',
  name: 'Temperature',
  unit: '°C',
  labelWidth: 46,
  data: randomLineData(twoWeekAndFuture, false, -10, 5),
  threshold: 0,
  thresholdColor: '#00f',
  thresholdDirection: 'down',
}];

export const SingleLineWithFutureDataAndThreshold = Template.bind({});

SingleLineWithFutureDataAndThreshold.args = {
  series: singleLineFuture,
  tooltip: true,
};

const barFuture: GraphSeries[] = [{
  key: 'barFuture',
  name: 'Temperature',
  unit: '°C',
  labelWidth: 46,
  data: randomLineData(twoWeekAndFuture, false, -10, 5),
  threshold: 0,
  thresholdColor: '#00f',
  thresholdDirection: 'down',
  type: 'bar',
}];

export const BarChartWithFutureDataAndThreshold = Template.bind({});

BarChartWithFutureDataAndThreshold.args = {
  series: barFuture,
  tooltip: true,
};

const sixtyDaysHourlyGraph: GraphSeries[] = [{
  key: 'barFuture',
  name: 'Temperature',
  unit: '°C',
  labelWidth: 46,
  data: parseJSONData(sixtyDayHourly),
  type: 'line',
}];

export const NavigationGraph = Template.bind({});

NavigationGraph.args = {
  series: sixtyDaysHourlyGraph,
  tooltip: true,
  navigation: true,
};

const extremeJumpsGraph: GraphSeries[] = [{
  key: 'barExtreme',
  name: 'Water level',
  color: '#00F',
  data: parseJSONData(extremeJumps),
  type: 'line',
}];

export const ExtremeCurvesGraph = Template.bind({});

ExtremeCurvesGraph.args = {
  series: extremeJumpsGraph,
  tooltip: true,
};

export const SimpleLineWithNowLabel = Template.bind({});

SimpleLineWithNowLabel.args = {
  series: singleLine,
  tooltip: true,
  now: new Date('2021-04-21T12:00:00.000Z'),
};
