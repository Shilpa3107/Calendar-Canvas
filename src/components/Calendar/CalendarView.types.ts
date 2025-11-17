export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
}

export type CalendarViewType = 'month' | 'week';

export interface CalendarViewProps {
  events: CalendarEvent[];
  onEventAdd: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
  initialView?: CalendarViewType;
  initialDate?: Date;
}
