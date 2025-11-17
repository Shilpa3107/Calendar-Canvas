"use client";

import React from 'react';
import { getCalendarGrid, format, addDate, startOfWeek } from '@/utils/date-utils';
import { CalendarCell } from './CalendarCell';
import { CalendarEvent } from './CalendarView.types';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newDate: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ currentDate, events, onDayClick, onEventClick, onEventDrop }) => {
  const grid = getCalendarGrid(currentDate);
  const weekStartsOn = 0; // Sunday
  const weekStart = startOfWeek(new Date(), { weekStartsOn });
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDate(weekStart, { days: i }), 'EEEE'));


  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      event.startDate.getFullYear() === day.getFullYear() &&
      event.startDate.getMonth() === day.getMonth() &&
      event.startDate.getDate() === day.getDate()
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  };

  const handleShowMore = (date: Date) => {
    // This could open a modal or navigate to a day view
    onDayClick(date);
  }

  return (
    <div className="flex-grow flex flex-col">
      <div className="grid grid-cols-7 border-r border-b border-neutral-200">
        {weekDays.map((day, index) => (
          <div key={`${day}-${index}`} className="text-center py-2 text-sm font-medium text-neutral-700 border-t border-l border-neutral-200 bg-neutral-50">
            <span className="hidden md:inline">{day}</span>
            <span className="md:hidden">{day.substring(0,3)}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 flex-grow border-r border-b border-neutral-200">
        {grid.map(day => (
          <CalendarCell
            key={day.toISOString()}
            date={day}
            currentMonth={currentDate}
            events={getEventsForDay(day)}
            onClick={onDayClick}
            onEventClick={onEventClick}
            onShowMoreClick={handleShowMore}
            onEventDrop={onEventDrop}
          />
        ))}
      </div>
    </div>
  );
};
