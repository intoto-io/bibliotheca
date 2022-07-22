import { GraphLine, HorizontalLine, VerticalLine } from '../types';

export function isHorizontalLine(line: GraphLine): line is HorizontalLine {
  return 'value' in line;
}

export function isVerticalLine(line: GraphLine): line is VerticalLine {
  return 'date' in line;
}

export function createMeanLevelLine(name: string, value: number): HorizontalLine {
  return {
    color: '#b7323f',
    indicator: true,
    opacity: 1,
    width: 1.5,
    dasharray: '5,3',
    name,
    value,
  };
}

export function createNowLine(date: Date): VerticalLine {
  return {
    name: 'now',
    date,
    color: '#000',
    opacity: 0.5,
    width: 1,
    dasharray: '8,8',
  };
}
