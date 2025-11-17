import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

const sampleEvents: CalendarEvent[] = [
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
];

const manyEvents: CalendarEvent[] = [
  ...sampleEvents,
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `evt-many-${i}`,
    title: `Event ${i + 4}`,
    startDate: new Date(new Date(new Date().setDate(i + 2)).setHours(Math.random() * 20, 0, 0, 0)),
    endDate: new Date(new Date(new Date().setDate(i + 2)).setHours(Math.random() * 20 + 1, 0, 0, 0)),
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i % 5],
  }))
];

const logEvent = (name: string) => (...args: any[]) => console.log(name, ...args);

export const Default: Story = {
  args: {
    events: sampleEvents,
    onEventAdd: logEvent('onEventAdd'),
    onEventUpdate: logEvent('onEventUpdate'),
    onEventDelete: logEvent('onEventDelete'),
  },
};

export const EmptyState: Story = {
  args: {
    ...Default.args,
    events: [],
  },
};

export const WeekView: Story = {
  args: {
    ...Default.args,
    initialView: 'week',
  },
};

export const WithManyEvents: Story = {
  args: {
    ...Default.args,
    events: manyEvents,
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [events, setEvents] = React.useState<CalendarEvent[]>(sampleEvents);

    const handleAdd = (event: Omit<CalendarEvent, 'id'>) => {
      const newEvent: CalendarEvent = { ...event, id: `evt-${Date.now()}` };
      setEvents(prev => [...prev, newEvent]);
    };
    const handleUpdate = (id: string, updates: Partial<CalendarEvent>) => {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };
    const handleDelete = (id: string) => {
      setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
      <CalendarView
        events={events}
        onEventAdd={handleAdd}
        onEventUpdate={handleUpdate}
        onEventDelete={handleDelete}
      />
    );
  }
};
