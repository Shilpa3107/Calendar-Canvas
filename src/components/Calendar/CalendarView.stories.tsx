import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onEventAdd: { action: 'onEventAdd' },
    onEventUpdate: { action: 'onEventUpdate' },
    onEventDelete: { action: 'onEventDelete' },
  },
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
    id: `evt-extra-${i}`,
    title: `Extra Event ${i + 1}`,
    startDate: new Date(new Date(new Date().setDate(Math.random() * 28)).setHours(Math.random() * 23, Math.random() > 0.5 ? 30 : 0, 0, 0)),
    endDate: new Date(new Date(new Date().setDate(Math.random() * 28)).setHours(Math.random() * 23, Math.random() > 0.5 ? 30 : 0, 0, 0)),
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)],
  })),
];

export const Default: Story = {
  name: 'Default (Month View)',
  args: {
    events: sampleEvents,
  },
};

export const EmptyState: Story = {
  name: 'Empty State',
  args: {
    events: [],
  },
};

export const WeekViewStory: Story = {
  name: 'Week View',
  args: {
    events: sampleEvents,
    initialView: 'week',
  },
};

export const WithManyEvents: Story = {
  name: 'With Many Events',
  args: {
    events: manyEvents,
  },
};

export const InteractiveDemo: Story = {
  name: 'Interactive Demo',
  render: (args) => {
    // This story will use the component's internal state managed by its hooks
    // The actions in argTypes will log interactions
    return <CalendarView {...args} />;
  },
  args: {
    events: sampleEvents,
  },
};

export const MobileView: Story = {
    name: 'Mobile View',
    parameters: {
      viewport: {
        defaultViewport: 'iphone6',
      },
    },
    args: {
        events: sampleEvents,
    },
};
