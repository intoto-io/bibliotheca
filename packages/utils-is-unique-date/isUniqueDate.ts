import { compareDesc } from 'date-fns';

function isUniqueDate(date: Date, otherDates: Date[]): boolean {
  return !otherDates.some((otherDate) => compareDesc(date, otherDate) === 0);
}

export default isUniqueDate;
