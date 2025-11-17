"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format, isToday, isSameMonth } from '@/utils/date-utils';
import { CalendarEvent } from './CalendarView.types';
import { Tooltip } from '../primitives/Tooltip';

interface CalendarCellProps {
  date: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onShowMoreClick: (date: Date) => void;
  onEventDrop: (eventId: string, newDate: Date) => void;
}

const MAX_VISIBLE_EVENTS = 3;

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(({
  date,
  currentMonth,
  events,
  onClick,
  onEventClick,
  onShowMoreClick,
  onEventDrop
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isClient && isToday(date);

  const handleCellClick = (e: React.MouseEvent) => {
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

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
    e.dataTransfer.effectAllowed = 'move';
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    onEventDrop(eventId, date);
  }

  const dayNumber = format(date, 'd');

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${format(date, 'MMMM d, yyyy')}. ${events.length} events.`}
      onClick={handleCellClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(date)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
          <Tooltip 
            key={event.id}
            content={`${event.title}: ${format(event.startDate, 'h:mm a')} - ${format(event.endDate, 'h:mm a')}`}
          >
            <div
              data-event-id={event.id}
              draggable
              onDragStart={(e) => handleDragStart(e, event.id)}
              onClick={(e) => handleEventClick(e, event)}
              className="text-xs text-white px-2 py-0.5 rounded truncate cursor-grab"
              style={{ backgroundColor: event.color || '#3b82f6' }}
            >
              {event.title}
            </div>
          </Tooltip>
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
