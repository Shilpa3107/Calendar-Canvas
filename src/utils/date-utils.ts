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
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);

  const startDayOfGrid = startOfWeek(firstDayOfMonth);
  const endDayOfGrid = endOfWeek(add(lastDayOfMonth, { days: 42 - eachDayOfInterval({start: startDayOfGrid, end: lastDayOfMonth}).length}));
  
  // Ensure we always have 42 days (6 weeks)
  const grid: Date[] = [];
  let day = startDayOfGrid;
  while(grid.length < 42){
      grid.push(day);
      day = add(day, {days: 1});
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
