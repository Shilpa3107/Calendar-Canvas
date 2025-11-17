"use client";

import React from 'react';
import { getWeekDays, getWeekHours, format, addDate } from '@/utils/date-utils';
import { CalendarEvent } from './CalendarView.types';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date) => void;
}

const getEventPositionAndHeight = (event: CalendarEvent, day: Date) => {
    if (event.startDate.toDateString() !== day.toDateString()) return null;

    const startHour = event.startDate.getHours();
    const startMinute = event.startDate.getMinutes();
    const endHour = event.endDate.getHours();
    const endMinute = event.endDate.getMinutes();

    const top = (startHour + startMinute / 60) * 4; // 4rem per hour
    const durationHours = (endHour + endMinute / 60) - (startHour + startMinute / 60);
    const height = durationHours * 4; // 4rem per hour

    return { top, height };
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onEventClick, onSlotClick }) => {
  const weekDays = getWeekDays(currentDate);
  const hours = getWeekHours(currentDate);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      event.startDate.getFullYear() === day.getFullYear() &&
      event.startDate.getMonth() === day.getMonth() &&
      event.startDate.getDate() === day.getDate()
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  };

  return (
    <div className="flex-grow flex flex-col overflow-auto">
      <div className="grid grid-cols-[auto_1fr] sticky top-0 bg-white z-10">
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
            <div key={day.toISOString()} className="relative border-l border-neutral-200">
              {hours.map(hour => (
                <div 
                    key={hour.toISOString()} 
                    className="h-16 border-t border-neutral-200 cursor-pointer hover:bg-primary-50"
                    onClick={() => onSlotClick(addDate(day, {hours: hour.getHours()}))}
                />
              ))}
              {getEventsForDay(day).map(event => {
                const pos = getEventPositionAndHeight(event, day);
                if (!pos) return null;
                return (
                  <div
                    key={event.id}
                    className="absolute left-1 right-1 p-2 rounded text-white text-xs z-10 overflow-hidden cursor-pointer"
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
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
