"use client";

import React, { useState, useCallback } from 'react';
import { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { useCalendar } from '@/hooks/useCalendar';
import { useEventManager } from '@/hooks/useEventManager';
import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { cn } from '@/lib/utils';
import { addDate } from '@/utils/date-utils';
import toast from 'react-hot-toast';

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

  const { events, addEvent, updateEvent, deleteEvent, findEvent } = useEventManager(initialEvents);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedEvent({ startDate: date, endDate: addDate(date, { hours: 1 }) });
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
    if(onEventAdd) onEventAdd(newEvent);
  };

  const handleUpdateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    updateEvent(id, updates);
    if(onEventUpdate) onEventUpdate(id, updates);
  };
  
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    if(onEventDelete) onEventDelete(id);
  };

  const handleEventDrop = useCallback((eventId: string, newDate: Date) => {
    const event = findEvent(eventId);
    if (!event) return;

    const duration = event.endDate.getTime() - event.startDate.getTime();
    const newStartDate = new Date(newDate);
    newStartDate.setHours(event.startDate.getHours(), event.startDate.getMinutes());
    
    const newEndDate = new Date(newStartDate.getTime() + duration);

    handleUpdateEvent(eventId, { startDate: newStartDate, endDate: newEndDate });
    toast.success(`Moved "${event.title}"`);
  }, [findEvent]);

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
          onEventDrop={handleEventDrop}
        />
      ) : (
        <WeekView 
          currentDate={currentDate} 
          events={events} 
          onEventClick={handleEventClick}
          onSlotClick={handleDayClick}
          onEventDrop={handleEventDrop}
          onEventAdd={handleSaveEvent}
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
