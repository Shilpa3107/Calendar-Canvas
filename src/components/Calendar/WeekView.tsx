"use client";

import React, { useState, useRef, useCallback } from 'react';
import { getWeekDays, getWeekHours, format, addDate, isSameDay } from '@/utils/date-utils';
import { CalendarEvent } from './CalendarView.types';
import { cn } from '@/lib/utils';
import { Tooltip } from '../primitives/Tooltip';

const HOUR_HEIGHT_REM = 4; // 4rem per hour, matching h-16
const MIN_EVENT_HEIGHT_REM = 2;

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date) => void;
  onEventDrop: (eventId: string, newDate: Date) => void;
  onEventAdd: (event: Omit<CalendarEvent, 'id'>) => void;
}

const getEventPositionAndHeight = (event: CalendarEvent, day: Date) => {
  if (!isSameDay(event.startDate, day)) return null;

  const startHour = event.startDate.getHours() + event.startDate.getMinutes() / 60;
  const endHour = event.endDate.getHours() + event.endDate.getMinutes() / 60;

  const top = startHour * HOUR_HEIGHT_REM;
  const durationHours = endHour - startHour;
  const height = Math.max(durationHours * HOUR_HEIGHT_REM, MIN_EVENT_HEIGHT_REM);

  return { top, height };
}

export const WeekView: React.FC<WeekViewProps> = ({ 
  currentDate, 
  events, 
  onEventClick, 
  onSlotClick,
  onEventDrop,
  onEventAdd
}) => {
  const weekDays = getWeekDays(currentDate);
  const hours = getWeekHours(currentDate);
  const gridRef = useRef<HTMLDivElement>(null);
  const [dragCreateState, setDragCreateState] = useState<{start: Date, end: Date} | null>(null);

  const getEventsForDay = useCallback((day: Date) => {
    return events.filter(event => isSameDay(event.startDate, day))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events]);

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getDateFromPosition = (day: Date, y: number): Date => {
      const gridTop = gridRef.current?.getBoundingClientRect().top || 0;
      const relativeY = y - gridTop;
      const hour = Math.floor(relativeY / (HOUR_HEIGHT_REM * 16)); // assuming 1rem = 16px
      const minutes = Math.floor(((relativeY % (HOUR_HEIGHT_REM * 16)) / (HOUR_HEIGHT_REM * 16)) * 60 / 15) * 15; // snap to 15 mins
      return addDate(day, { hours: hour, minutes: minutes });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if(dragCreateState) {
        const end = getDateFromPosition(dragCreateState.start, e.clientY);
        if(end > dragCreateState.start) {
            setDragCreateState(prev => prev ? {...prev, end} : null);
        }
    }
  };

  const handleDrop = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId) {
        const newTime = getDateFromPosition(day, e.clientY);
        onEventDrop(eventId, newTime);
    } else if (dragCreateState) {
        onEventAdd({
            title: 'New Event',
            startDate: dragCreateState.start,
            endDate: dragCreateState.end
        });
        setDragCreateState(null);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent, day: Date, hour: Date) => {
      if ((e.target as HTMLElement).closest('[data-event-id]')) return;
      const start = addDate(day, {hours: hour.getHours()});
      setDragCreateState({ start, end: addDate(start, {minutes: 30})});
  }

  const handleMouseUp = () => {
      if(dragCreateState) {
          // Could be a click, check duration
          const duration = dragCreateState.end.getTime() - dragCreateState.start.getTime();
          if (duration < 5 * 60 * 1000) { // less than 5 minutes
            onSlotClick(dragCreateState.start);
          } else {
             onEventAdd({
                title: 'New Event',
                startDate: dragCreateState.start,
                endDate: dragCreateState.end
            });
          }
          setDragCreateState(null);
      }
  }

  return (
    <div className="flex-grow flex flex-col overflow-auto" ref={gridRef}>
      <div className="grid grid-cols-[auto_1fr] sticky top-0 bg-white z-20">
        <div className="w-16 border-r border-neutral-200"></div>
        <div className="grid grid-cols-7">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="text-center py-2 border-b border-l border-neutral-200">
              <div className="text-xs text-neutral-500">{format(day, 'EEE')}</div>
              <div className="text-lg font-semibold">{format(day, 'd')}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] flex-grow">
        <div className="w-16 border-r border-neutral-200">
          {hours.map(hour => (
            <div key={hour.toISOString()} className="h-16 relative">
              <span className="absolute -top-2 right-2 text-xs text-neutral-500">
                {format(hour, 'ha')}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {weekDays.map(day => (
            <div 
                key={day.toISOString()} 
                className="relative border-l border-neutral-200"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
                onMouseUp={handleMouseUp}
            >
              {hours.map(hour => (
                <div 
                    key={hour.toISOString()} 
                    className="h-16 border-t border-neutral-200 cursor-cell"
                    onMouseDown={(e) => handleMouseDown(e, day, hour)}
                />
              ))}
              {getEventsForDay(day).map(event => {
                const pos = getEventPositionAndHeight(event, day);
                if (!pos) return null;
                return (
                  <Tooltip 
                    key={event.id}
                    content={`${event.title}: ${format(event.startDate, 'h:mm a')} - ${format(event.endDate, 'h:mm a')}`}
                  >
                    <div
                      key={event.id}
                      data-event-id={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event.id)}
                      className="absolute left-1 right-1 p-2 rounded text-white text-xs z-10 overflow-hidden cursor-grab"
                      style={{ 
                          top: `${pos.top}rem`, 
                          height: `${pos.height}rem`,
                          backgroundColor: event.color
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <p className='font-bold'>{event.title}</p>
                      <p>{format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}</p>
                    </div>
                  </Tooltip>
                );
              })}
              {dragCreateState && isSameDay(dragCreateState.start, day) && (
                  <div 
                    className="absolute left-1 right-1 bg-primary-500/30 rounded-lg z-20"
                    style={{
                        top: `${(dragCreateState.start.getHours() + dragCreateState.start.getMinutes()/60) * HOUR_HEIGHT_REM}rem`,
                        height: `${Math.max(MIN_EVENT_HEIGHT_REM, (dragCreateState.end.getTime() - dragCreateState.start.getTime()) / (1000 * 60 * 60) * HOUR_HEIGHT_REM)}rem`
                    }}
                  />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
