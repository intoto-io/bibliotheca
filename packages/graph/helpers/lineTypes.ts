import { GraphLine, HorizontalLine, VerticalLine } from '../types';

export function isHorizontalLine(line: GraphLine): line is HorizontalLine {
  return 'value' in line;
}

export function isVerticalLine(line: GraphLine): line is VerticalLine {
  return 'date' in line;
}
