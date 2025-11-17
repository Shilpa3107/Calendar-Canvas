"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../primitives/Button';
import { Select } from '../primitives/Select';
import { format, getMonth, getYear } from '@/utils/date-utils';
import { CalendarViewType } from './CalendarView.types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarViewType;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
  onViewChange: (view: CalendarViewType) => void;
  onDateChange: (date: Date) => void;
}

const months = Array.from({ length: 12 }, (_, i) => ({ value: i.toString(), label: format(new Date(2000, i, 1), 'MMMM') }));
const years = Array.from({ length: 20 }, (_, i) => ({ value: (getYear(new Date()) - 10 + i).toString(), label: (getYear(new Date()) - 10 + i).toString() }));

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onNext,
  onPrevious,
  onToday,
  onViewChange,
  onDateChange,
}) => {

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate.setMonth(parseInt(month, 10)));
    onDateChange(newDate);
  }
  
  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate.setFullYear(parseInt(year, 10)));
    onDateChange(newDate);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-b border-neutral-200">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-neutral-900 hidden md:block">Calendar Canvas</h1>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={onPrevious} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNext} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={onToday} className="hidden sm:inline-flex">
          Today
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={getMonth(currentDate).toString()}
          onChange={handleMonthChange}
          options={months}
          className="w-32"
        />
        <Select
          value={getYear(currentDate).toString()}
          onChange={handleYearChange}
          options={years}
          className="w-24"
        />
      </div>

      <div className="p-1 bg-neutral-200 rounded-md">
        <Button
          variant={view === 'month' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('month')}
          className={view === 'month' ? 'bg-white text-neutral-900 shadow-sm' : ''}
        >
          Month
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('week')}
          className={view === 'week' ? 'bg-white text-neutral-900 shadow-sm' : ''}
        >
          Week
        </Button>
      </div>
    </div>
  );
};
