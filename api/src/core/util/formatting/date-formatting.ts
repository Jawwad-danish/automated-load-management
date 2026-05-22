import dayjs from 'dayjs';

export const monthDayYear = (date: Date): string => {
  return dayjs.utc(date).format('MM/DD/YY');
};
