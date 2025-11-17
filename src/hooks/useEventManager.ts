"use client";

import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/components/Calendar/CalendarView.types';

export const useEventManager = (initialEvents: CalendarEvent[] = []) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${new Date().getTime()}-${Math.random()}`,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const getEventsForDay = useCallback((date: Date) => {
    return events
      .filter(event => 
        event.startDate.getFullYear() === date.getFullYear() &&
        event.startDate.getMonth() === date.getMonth() &&
        event.startDate.getDate() === date.getDate()
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events]);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
  };
};
