# Calendar Canvas

A feature-rich, interactive calendar component built with modern web technologies. This project is a production-grade implementation of a calendar view, designed to be both highly functional and aesthetically pleasing.

## Live Storybook

[Link to your deployed Storybook instance will go here]

## Installation

To get this project running locally, follow these steps:

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Navigate to the project directory
cd calendar-canvas

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev
```

The application will be available at `http://localhost:9002`.

## Architecture

This project is built on a robust and scalable architecture, centered around Next.js and a modular component design.

-   **Component-Based Structure:** The UI is broken down into reusable components located in `src/components`. The main `CalendarView` component orchestrates various sub-components like `MonthView`, `WeekView`, and `EventModal`. A `primitives` directory holds foundational UI elements.
-   **Custom Hooks:** Core logic is abstracted into custom hooks for better state management and separation of concerns. `useCalendar` handles date navigation and view switching, while `useEventManager` manages all CRUD operations for events.
-   **Utility-First Styling:** Styling is handled exclusively with Tailwind CSS, customized via `tailwind.config.ts` to maintain a consistent design system.
-   **TypeScript:** The entire codebase is written in TypeScript, ensuring type safety and improved developer experience.

## Features

-   [x] **Dual Views:** Seamlessly switch between Month and Week views.
-   [x] **Interactive Event Management:** Create, update, and delete events through an intuitive modal.
-   [x] **Drag-and-Drop:** Easily move events to new dates and times.
-   [x] **Drag-to-Create:** Quickly create new events by dragging directly on the calendar.
-   [x] **Responsive Design:** A fully responsive layout that adapts to all screen sizes.
-   [x] **Accessibility:** Enhanced keyboard navigation and ARIA attributes for a better user experience.
-   [x] **Tooltips:** Get quick event details by hovering over them.

## Technologies

-   **Framework:** Next.js
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Date Management:** `date-fns`
-   **Icons:** `lucide-react`

## Contact

[your-email@example.com]
