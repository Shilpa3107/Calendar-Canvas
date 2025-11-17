"use client";

import { useState, useCallback } from 'react';
import { add, sub } from 'date-fns';
import type { CalendarViewType } from '@/components/Calendar/CalendarView.types';

export const useCalendar = (initialDate: Date = new Date(), initialView: CalendarViewType = 'month') => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarViewType>(initialView);

  const goToNext = useCallback(() => {
    const unit = view === 'month' ? { months: 1 } : { weeks: 1 };
    setCurrentDate(prev => add(prev, unit));
  }, [view]);

  const goToPrevious = useCallback(() => {
    const unit = view === 'month' ? { months: 1 } : { weeks: 1 };
    setCurrentDate(prev => sub(prev, unit));
  }, [view]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const changeView = useCallback((newView: CalendarViewType) => {
    setView(newView);
  }, []);

  const setDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  return {
    currentDate,
    view,
    goToNext,
    goToPrevious,
    goToToday,
    changeView,
    setDate,
  };
};
