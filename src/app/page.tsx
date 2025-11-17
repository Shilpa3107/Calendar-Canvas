"use client";

import { CalendarView } from "@/components/Calendar/CalendarView";
import { CalendarEvent } from "@/components/Calendar/CalendarView.types";
import { useState, useEffect } from "react";

const createSampleEvents = (): CalendarEvent[] => [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(new Date().setHours(9, 0, 0, 0)),
    endDate: new Date(new Date().setHours(9, 30, 0, 0)),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(new Date().setHours(14, 0, 0, 0)),
    endDate: new Date(new Date().setHours(15, 30, 0, 0)),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    startDate: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10, 0, 0, 0)),
    endDate: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 30, 0, 0)),
    color: '#f59e0b',
    category: 'Meeting',
  },
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    startDate: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(9, 0, 0, 0)),
    endDate: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(17, 0, 0, 0)),
    color: '#8b5cf6',
    category: 'Work',
  },
];


export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setEvents(createSampleEvents());
  }, []);

  const handleAdd = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
        ...event,
        id: `evt-${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent]);
    console.log('Event added:', newEvent);
  };

  const handleUpdate = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    console.log('Event updated:', id, updates);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    console.log('Event deleted:', id);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-neutral-100">
      <CalendarView 
        events={events}
        onEventAdd={handleAdd}
        onEventUpdate={handleUpdate}
        onEventDelete={handleDelete}
      />
    </main>
  );
}
