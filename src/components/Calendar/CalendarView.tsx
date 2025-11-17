"use client";

import React, { useState } from 'react';
import { CalendarViewProps, CalendarEvent, CalendarViewType } from './CalendarView.types';
import { useCalendar } from '@/hooks/useCalendar';
import { useEventManager } from '@/hooks/useEventManager';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { cn } from '@/lib/utils';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events: initialEvents,
  initialDate,
  initialView,
  onEventAdd,
  onEventUpdate,
  onEventDelete
}) => {
  const { 
    currentDate, 
    view, 
    goToNext, 
    goToPrevious, 
    goToToday, 
    changeView,
    setDate
  } = useCalendar(initialDate, initialView);

  const { events, addEvent, updateEvent, deleteEvent } = useEventManager(initialEvents);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedEvent({ startDate: date, endDate: date });
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent = addEvent(eventData);
    onEventAdd(newEvent);
  };

  const handleUpdateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    updateEvent(id, updates);
    onEventUpdate(id, updates);
  };
  
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    onEventDelete(id);
  };

  return (
    <div className="bg-white rounded-xl shadow-card w-full h-[95vh] flex flex-col">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onNext={goToNext}
        onPrevious={goToPrevious}
        onToday={goToToday}
        onViewChange={changeView}
        onDateChange={setDate}
      />
      
      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          events={events}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      ) : (
        <WeekView 
          currentDate={currentDate} 
          events={events} 
          onEventClick={handleEventClick}
          onSlotClick={handleDayClick}
        />
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
      />
    </div>
  );
};
