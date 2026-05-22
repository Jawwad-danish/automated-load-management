import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const BUSINESS_TIMEZONE = 'America/New_York';

export const getUTCDate = (date?: dayjs.ConfigType): dayjs.Dayjs => {
  return dayjs.utc(date);
};

export const getDateInTimezone = (
  date?: dayjs.ConfigType,
  tz?: string | undefined,
): dayjs.Dayjs => {
  return dayjs.tz(date, tz);
};

export const getDateInBusinessTimezone = (date?: dayjs.ConfigType) => {
  return getDateInTimezone(date, BUSINESS_TIMEZONE);
};

export const getCurrentLocalDate = (): dayjs.Dayjs => {
  return getDateInTimezone();
};

export const getCurrentUTCDate = (): dayjs.Dayjs => {
  return getUTCDate();
};
