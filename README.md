# Kanban Board Application

A fully interactive Kanban-style board built with React, TypeScript, Material-UI, and React Query featuring drag-and-drop, infinite scroll, and real-time search.

## Features

- **4 Column Layout**: Backlog, In Progress, Review, Done
- **CRUD Operations**: Create, Read, Update, and Delete tasks
- **Drag & Drop**: Smooth drag-and-drop animations using @dnd-kit
- **Infinite Scroll**: Load more tasks as you scroll in each column
- **Real-time Search**: Debounced search across all tasks with highlighted matches
- **React Query Caching**: Efficient data fetching and caching
- **Redux State Management**: Global state for search and UI
- **Optimistic Updates**: Instant UI feedback on mutations
- **Responsive Design**: Mobile-friendly Material-UI components

## Tech Stack

- **React** 19.1.1
- **TypeScript** 5.9.3
- **Vite** 7.1.7
- **Material-UI** 7.3.4
- **@tanstack/react-query** 5.90.5
- **@reduxjs/toolkit** 2.9.2
- **@dnd-kit** 6.3.1
- **json-server** 1.0.0-beta.3

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MindLuster-Assessment
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

You need to run **two separate terminals**:

#### Terminal 1: Start the JSON Server (Backend)
```bash
npm run server
```
This starts the mock API server on `http://localhost:4000`

#### Terminal 2: Start the React App (Frontend)
```bash
npm run dev
```
This starts the development server on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── Kanban/
│       ├── KanbanBoard.tsx       # Main board with DnD context
│       ├── KanbanColumn.tsx      # Column with infinite scroll
│       ├── TaskCard.tsx          # Draggable task card
│       ├── TaskModal.tsx         # Create/Edit/Delete modals
│       └── SearchBar.tsx         # Debounced search input
├── hooks/
│   └── useTasks.ts               # React Query hooks for tasks
├── services/
│   └── api/
│       └── tasks.api.ts          # API client for CRUD operations
├── types/
│   └── task.types.ts             # TypeScript interfaces
├── utils/
│   ├── constants/
│   │   └── kanban.constants.ts  # Column definitions & constants
│   ├── providers/                # React Query, Redux, Theme providers
│   ├── store/
│   │   ├── slices/
│   │   │   ├── search.slice.ts  # Search state management
│   │   │   └── ui.slice.ts      # UI state (modals, dialogs)
│   │   └── store.config.ts      # Redux store configuration
│   └── theme/
│       └── index.ts             # Material-UI theme config
└── App.tsx                       # Root component
```

## Usage

### Creating a Task

1. Click the "Add Task" button in any column
2. Fill in the title and description
3. Select the status (column)
4. Click "Create"

### Editing a Task

1. Hover over a task card
2. Click the edit icon (pencil)
3. Modify the fields
4. Click "Update"

### Deleting a Task

1. Hover over a task card
2. Click the delete icon (trash)
3. Confirm deletion

### Moving Tasks (Drag & Drop)

1. Click and hold the drag handle (≡) on any task card
2. Drag to another column
3. Release to drop
4. The task status will automatically update

### Searching Tasks

1. Type in the search bar at the top
2. Search is debounced (300ms) for performance
3. Matching text is highlighted in yellow
4. Search filters all columns in real-time

### Infinite Scroll

- Scroll to the bottom of any column
- More tasks load automatically
- Each page loads 10 tasks
- Loading indicator shows while fetching

## API Endpoints

The json-server provides these endpoints:

- `GET /tasks` - Get all tasks (with pagination, search)
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /tasks/:id` - Get a single task

Query parameters:
- `column` - Filter by column (backlog, in_progress, review, done)
- `q` - Full-text search
- `_page` - Page number
- `_limit` - Items per page

## Customization

### Changing Column Colors

Edit `src/utils/constants/kanban.constants.ts`:

```typescript
export const COLUMNS: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#your-color-here',
  },
  // ...
];
```

### Adjusting Infinite Scroll Page Size

Edit `src/utils/constants/kanban.constants.ts`:

```typescript
export const TASKS_PER_PAGE = 10; // Change to your preferred number
```

### Modifying Search Debounce Time

Edit `src/utils/constants/kanban.constants.ts`:

```typescript
export const SEARCH_DEBOUNCE_MS = 300; // Change to your preferred delay
```

## Features in Detail

### Drag & Drop

- Uses `@dnd-kit/core` for modern, accessible drag-and-drop
- Smooth animations with CSS transforms
- Visual feedback during drag (overlay, opacity)
- 8px activation threshold to prevent accidental drags
- Automatic API update when dropped in new column

### Infinite Scroll

- Intersection Observer API for performance
- Loads 10 tasks per page by default
- Shows loading spinner while fetching
- Handles "no more tasks" state gracefully
- Preserves scroll position during updates

### Search

- Debounced input (300ms) to reduce API calls
- Searches both title and description
- Highlights matching text in yellow
- Clears with one click
- Synced with Redux for persistence

### State Management

**React Query** for server state:
- Automatic caching and invalidation
- Optimistic updates for instant feedback
- Error handling with rollback
- Background refetching

**Redux** for UI state:
- Search query (persisted to localStorage)
- Modal open/close states
- Selected task for editing
- Task to delete confirmation

## Performance Optimizations

- React Query caching reduces network requests
- Debounced search prevents excessive API calls
- Optimistic updates for instant UI feedback
- Infinite scroll loads data on-demand
- Type-safe TypeScript prevents runtime errors
- Production build with tree-shaking and minification

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
