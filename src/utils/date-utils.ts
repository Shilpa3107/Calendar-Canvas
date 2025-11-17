import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay as fnsIsSameDay,
  add,
  getMonth,
  getYear,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';

/**
 * Checks if two dates fall on the same day (ignores time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return fnsIsSameDay(date1, date2);
};

/**
 * Gets the calendar grid (42 cells for month view)
 */
export const getCalendarGrid = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);

  const startDay = startOfWeek(firstDay);

  const grid: Date[] = [];
  let currentDay = startDay;
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }
  return grid;
};

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return eachDayOfInterval({ start, end });
};

export const getWeekHours = (date: Date): Date[] => {
    const start = startOfDay(date);
    const end = endOfDay(date);
    return eachHourOfInterval({ start, end });
}

export {
  format,
  isSameMonth,
  isToday,
  getMonth,
  getYear,
  startOfWeek,
  add as addDate,
};
