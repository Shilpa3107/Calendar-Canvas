"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { format, isToday, isSameMonth } from '@/utils/date-utils';
import { CalendarEvent } from './CalendarView.types';

interface CalendarCellProps {
  date: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onShowMoreClick: (date: Date) => void;
}

const MAX_VISIBLE_EVENTS = 3;

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(({
  date,
  currentMonth,
  events,
  onClick,
  onEventClick,
  onShowMoreClick,
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isToday(date);

  const handleCellClick = (e: React.MouseEvent) => {
    // Only trigger full cell click if not clicking on an event or "more" button
    const target = e.target as HTMLElement;
    if (target.closest('[data-event-id]') || target.closest('[data-show-more]')) {
      return;
    }
    onClick(date);
  };
  
  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    onEventClick(event);
  };

  const handleShowMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowMoreClick(date);
  }

  const dayNumber = format(date, 'd');

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${format(date, 'MMMM d, yyyy')}. ${events.length} events.`}
      onClick={handleCellClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(date)}
      className={cn(
        "border-t border-l border-neutral-200 h-32 p-2 flex flex-col hover:bg-neutral-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10",
        !isCurrentMonth && "bg-neutral-50 text-neutral-400"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={cn(
            "text-sm font-medium",
            isTodayDate ? "text-white" : "text-neutral-900",
            !isCurrentMonth && "text-neutral-400"
          )}
        >
          {!isTodayDate && dayNumber}
        </span>
        {isTodayDate && (
          <span className="w-7 h-7 bg-primary-500 rounded-full text-white text-sm flex items-center justify-center font-semibold">
            {dayNumber}
          </span>
        )}
      </div>

      <div className="space-y-1 overflow-hidden flex-grow">
        {events.slice(0, MAX_VISIBLE_EVENTS).map(event => (
          <div
            key={event.id}
            data-event-id={event.id}
            onClick={(e) => handleEventClick(e, event)}
            className="text-xs text-white px-2 py-0.5 rounded truncate"
            style={{ backgroundColor: event.color || '#3b82f6' }}
          >
            {event.title}
          </div>
        ))}
        {events.length > MAX_VISIBLE_EVENTS && (
          <button
            data-show-more
            onClick={handleShowMore}
            className="text-xs text-primary-600 hover:underline"
          >
            +{events.length - MAX_VISIBLE_EVENTS} more
          </button>
        )}
      </div>
    </div>
  );
});

CalendarCell.displayName = 'CalendarCell';
