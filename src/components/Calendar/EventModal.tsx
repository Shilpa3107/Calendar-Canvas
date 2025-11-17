"use client";

import React, { useState, useEffect } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onDelete: (id: string) => void;
  event: Partial<CalendarEvent> | null;
}

const colors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#ec4899', // pink
];

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onUpdate, onDelete, event }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStartDate(event.startDate ? format(event.startDate, "yyyy-MM-dd'T'HH:mm") : '');
      setEndDate(event.endDate ? format(event.endDate, "yyyy-MM-dd'T'HH:mm") : '');
      setColor(event.color || colors[0]);
    } else {
      // Reset form for new event
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setColor(colors[0]);
    }
  }, [event]);

  const handleSave = () => {
    if (!title) {
      toast.error('Title is required.');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Start and end dates are required.');
      return;
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (end < start) {
      toast.error('End date must be after start date.');
      return;
    }

    const eventData = { title, description, startDate: start, endDate: end, color };

    if (event?.id) {
      onUpdate(event.id, eventData);
      toast.success('Event updated!');
    } else {
      onSave(eventData);
      toast.success('Event created!');
    }
    onClose();
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
      toast.success('Event deleted.');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event?.id ? 'Edit Event' : 'Add Event'}
      description="Fill in the details for your event."
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-neutral-700">Start Date</label>
            <input
              type="datetime-local"
              id="start-date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-neutral-700">End Date</label>
            <input
              type="datetime-local"
              id="end-date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Color</label>
          <div className="mt-2 flex items-center space-x-2">
            {colors.map(c => (
              <button
                key={c}
                type="button"
                className={`h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${color === c ? 'ring-2 ring-offset-1 ring-primary-500' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div>
            {event?.id && (
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { EventModal };
