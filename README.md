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

## Architecture

### Overview

The application follows a modern React architecture with clear separation of concerns across three main layers:

1. **Presentation Layer** - React components with Material-UI
2. **State Management Layer** - Redux (UI state) + React Query (Server state)
3. **Data Layer** - REST API via json-server

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                            App.tsx                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Provider Stack                         │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ ThemeProvider (Material-UI)                         │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │ ReduxProvider (UI State)                      │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │ ReactQueryProvider (Server State)       │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │      KanbanBoard                  │  │  │  │  │  │
│  │  │  │  │  │  ┌─────────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │ DndContext (@dnd-kit)       │  │  │  │  │  │  │
│  │  │  │  │  │  │  ┌───────────────────────┐  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │   SearchBar           │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  └───────────────────────┘  │  │  │  │  │  │  │
│  │  │  │  │  │  │  ┌───────────────────────┐  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │  KanbanColumn (x4)    │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │   - TaskCard (x n)    │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │   - Infinite Scroll   │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │   - Add Task Button   │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  └───────────────────────┘  │  │  │  │  │  │  │
│  │  │  │  │  │  │  ┌───────────────────────┐  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │   TaskModal           │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  │   DeleteDialog        │  │  │  │  │  │  │  │
│  │  │  │  │  │  │  └───────────────────────┘  │  │  │  │  │  │  │
│  │  │  │  │  │  └─────────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

#### 1. Read Operations (Fetching Tasks)

```
User Action → Component
              ↓
         useTasks Hook (React Query)
              ↓
         tasks.api.ts (Axios)
              ↓
         json-server API
              ↓
         React Query Cache ← Auto-refetch (staleTime)
              ↓
         Component Re-render
```

#### 2. Write Operations (Create/Update/Delete)

```
User Action → Component
              ↓
         Mutation Hook (React Query)
              ↓
         Optimistic Update (instant UI feedback)
              ↓
         tasks.api.ts (Axios)
              ↓
         json-server API
              ↓
         Success: Cache Invalidation → Refetch
         Error: Rollback to previous state
```

#### 3. Search Flow

```
User Types → SearchBar Component
              ↓
         Debounce (300ms)
              ↓
         Redux (search.slice.ts) ← Persisted to localStorage
              ↓
         KanbanColumn subscribes to Redux state
              ↓
         useTasks Hook receives search query
              ↓
         API call with ?q=searchTerm
              ↓
         Filtered results rendered with highlights
```

#### 4. Drag & Drop Flow

```
User Drags Task → @dnd-kit DndContext
                   ↓
              onDragEnd Event
                   ↓
              Extract: taskId, oldColumn, newColumn
                   ↓
              updateTaskMutation (React Query)
                   ↓
              Optimistic Update: Move task in UI instantly
                   ↓
              API Call: PATCH /tasks/:id { column: newColumn }
                   ↓
              Success: Invalidate cache → Background refetch
              Error: Revert task to original column
```

### State Management Layers

#### Server State (React Query)

**Purpose:** Manage async data from the API

**Responsibilities:**
- Fetching tasks from the backend
- Caching responses (reduces network requests)
- Background refetching (keeps data fresh)
- Optimistic updates (instant UI feedback)
- Error handling with automatic rollback
- Pagination state for infinite scroll

**Key Hooks:**
- `useTasksQuery` - Fetch tasks by column & search
- `useCreateTaskMutation` - Create new task
- `useUpdateTaskMutation` - Update task
- `useDeleteTaskMutation` - Delete task

**Configuration:**
- `staleTime: 60000ms` - Data fresh for 1 minute
- `cacheTime: 300000ms` - Cache kept for 5 minutes
- Auto-refetch on window focus
- Retry failed requests (3 attempts)

#### UI State (Redux Toolkit)

**Purpose:** Manage client-side UI state

**Responsibilities:**
- Search query (persisted to localStorage)
- Modal open/close states (create, edit, delete)
- Selected task for editing
- Task to delete (for confirmation dialog)

**Slices:**
- `search.slice.ts` - Search query state
- `ui.slice.ts` - Modal and dialog states

**Why Redux for UI state?**
- Search needs to be shared across all columns
- Search should persist across page reloads
- Modal state needs to be accessible from multiple components
- Provides time-travel debugging with Redux DevTools

#### Local State (React useState)

**Purpose:** Component-specific transient state

**Examples:**
- Form input values (before submission)
- Intersection Observer for infinite scroll
- Drag overlay visibility
- Loading indicators

### API Client Architecture

**File:** `src/services/api/tasks.api.ts`

**Design Pattern:** Centralized API client using Axios

**Benefits:**
- Single source of truth for API endpoints
- Consistent error handling
- Type-safe requests and responses
- Easy to mock for testing
- Base URL configuration in one place

**Functions:**
- `fetchTasks(params)` - GET /tasks with filtering
- `createTask(task)` - POST /tasks
- `updateTask(id, updates)` - PATCH /tasks/:id
- `deleteTask(id)` - DELETE /tasks/:id

### Performance Optimizations

1. **React Query Caching**
   - Reduces redundant API calls
   - Background refetching keeps data fresh
   - Automatic cache invalidation on mutations

2. **Debounced Search**
   - 300ms delay prevents excessive API calls
   - Only searches after user stops typing

3. **Infinite Scroll**
   - Loads 10 tasks per page (configurable)
   - Only fetches more when user scrolls to bottom
   - Uses Intersection Observer API

4. **Optimistic Updates**
   - UI updates instantly before API confirmation
   - Automatic rollback on errors
   - Improves perceived performance

5. **Code Splitting**
   - Vite automatically splits code by route
   - Lazy loading for better initial load time

6. **Redux Persist**
   - Search query saved to localStorage
   - Prevents data loss on page refresh
   - Reduces initial API calls

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

## Development Workflow

### Setting Up Your Development Environment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start both servers** (required for development):
   ```bash
   # Terminal 1 - Backend API
   npm run server

   # Terminal 2 - Frontend Dev Server
   npm run dev
   ```

3. **Verify setup:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - API Health check: http://localhost:4000/tasks

### Code Organization Best Practices

#### Where to Add New Files

| What you're adding | Where it goes | Example |
|-------------------|---------------|---------|
| New component | `src/components/[feature-name]/` | `src/components/Dashboard/` |
| Shared component | `src/components/` | `src/components/Button/` |
| Custom hook | `src/hooks/` | `src/hooks/useAuth.ts` |
| API function | `src/services/api/` | `src/services/api/users.api.ts` |
| TypeScript type | `src/types/` | `src/types/user.types.ts` |
| Constant | `src/utils/constants/` | `src/utils/constants/routes.ts` |
| Redux slice | `src/utils/store/slices/` | `src/utils/store/slices/auth.slice.ts` |
| Provider | `src/utils/providers/` | `src/utils/providers/auth-provider/` |
| Theme customization | `src/utils/theme/` | `src/utils/theme/colors.ts` |

#### File Naming Conventions

```
✅ Good:
- KanbanBoard.tsx (PascalCase for components)
- useTasks.ts (camelCase for hooks with 'use' prefix)
- task.types.ts (camelCase with descriptive suffix)
- kanban.constants.ts (camelCase with descriptive suffix)

❌ Avoid:
- kanbanboard.tsx
- TasksHook.ts
- TASK_TYPES.ts
```

### Adding New Features

#### Example: Adding a New Task Priority Field

**Step 1: Update Types**
```typescript
// src/types/task.types.ts
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: TaskStatus;
  priority?: TaskPriority; // Add new field
}
```

**Step 2: Update API Client (if needed)**
```typescript
// src/services/api/tasks.api.ts
// No changes needed - PATCH already sends all task fields
```

**Step 3: Update UI Components**
```typescript
// src/components/Kanban/task-modal/TaskModal.tsx
// Add priority select field to form
<Select value={priority} onChange={handlePriorityChange}>
  <MenuItem value="low">Low</MenuItem>
  <MenuItem value="medium">Medium</MenuItem>
  <MenuItem value="high">High</MenuItem>
</Select>
```

**Step 4: Update Database**
```json
// db.json - Add priority to existing tasks
{
  "tasks": [
    {
      "id": "1",
      "title": "Task 1",
      "priority": "high"
    }
  ]
}
```

**Step 5: Test**
- Create new task with priority
- Edit existing task priority
- Verify API calls in DevTools

### State Management Guidelines

#### When to Use React Query

✅ Use React Query for:
- Fetching data from APIs
- Server state synchronization
- Caching API responses
- Optimistic updates
- Pagination
- Background refetching

```typescript
// Example: Fetching data
const { data, isLoading, error } = useTasksQuery({
  column: 'backlog',
  search: '',
});
```

#### When to Use Redux

✅ Use Redux for:
- UI state shared across many components
- State that should persist (with redux-persist)
- Complex state updates
- State that needs debugging with DevTools

```typescript
// Example: UI state
const dispatch = useDispatch();
dispatch(openTaskModal({ mode: 'create' }));
```

#### When to Use Local State

✅ Use useState for:
- Form inputs (before submission)
- Component-specific UI state
- Temporary state
- State that doesn't need sharing

```typescript
// Example: Form input
const [title, setTitle] = useState('');
```

### TypeScript Best Practices

#### Always Define Types

```typescript
// ✅ Good: Explicit types
interface CreateTaskParams {
  title: string;
  description: string;
  column: TaskStatus;
}

const createTask = async (params: CreateTaskParams): Promise<Task> => {
  // ...
};

// ❌ Avoid: Implicit any
const createTask = async (params) => {
  // ...
};
```

#### Use Type Guards

```typescript
// ✅ Good: Type-safe checks
const isValidStatus = (status: string): status is TaskStatus => {
  return ['backlog', 'in_progress', 'review', 'done'].includes(status);
};
```

#### Export Types

```typescript
// ✅ Good: Centralized types
export type { Task, TaskStatus, Column };
export interface { CreateTaskDTO, UpdateTaskDTO };
```

### Common Development Tasks

#### Adding a New Column

1. **Update constants:**
   ```typescript
   // src/utils/constants/kanban.constants.ts
   export const COLUMNS: Column[] = [
     // ... existing columns
     {
       id: 'archived',
       title: 'Archived',
       color: '#9E9E9E',
     },
   ];
   ```

2. **Update TypeScript types:**
   ```typescript
   // src/types/task.types.ts
   export type TaskStatus =
     | 'backlog'
     | 'in_progress'
     | 'review'
     | 'done'
     | 'archived'; // Add new status
   ```

3. **UI automatically updates** - The KanbanBoard component maps over COLUMNS array

#### Adding a New Filter

1. **Create Redux slice (if UI state):**
   ```typescript
   // src/utils/store/slices/filter.slice.ts
   const filterSlice = createSlice({
     name: 'filter',
     initialState: { priority: null },
     reducers: {
       setPriorityFilter: (state, action) => {
         state.priority = action.payload;
       },
     },
   });
   ```

2. **Update API client:**
   ```typescript
   // src/services/api/tasks.api.ts
   export const fetchTasks = async (params: {
     column?: TaskStatus;
     search?: string;
     priority?: TaskPriority; // Add new param
   }) => {
     const response = await axios.get('/tasks', { params });
     return response.data;
   };
   ```

3. **Add filter UI component**

#### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages (careful!)
npm update

# Verify nothing broke
npm run build
npm run lint
```

### Debugging Tips

#### React Query DevTools

Already enabled in development mode:
- View cached queries
- See query status (loading, error, success)
- Manually trigger refetches
- Inspect query data

#### Redux DevTools

Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
- Time-travel debugging
- View action history
- Inspect state changes
- Export/import state

#### Common Issues

**Issue: Tasks not loading**
```bash
# Check if json-server is running
curl http://localhost:4000/tasks

# If not, start it
npm run server
```

**Issue: Search not working**
- Check Redux state in DevTools
- Verify debounce is working (300ms delay)
- Check API call in Network tab

**Issue: Drag & drop not working**
- Verify @dnd-kit packages are installed
- Check console for errors
- Ensure tasks have unique IDs

**Issue: Type errors**
```bash
# Run TypeScript compiler
npm run build

# Check for type errors only
npx tsc --noEmit
```

### Code Quality

#### ESLint

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

#### TypeScript Strict Mode

This project uses strict TypeScript:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

Always fix type errors before committing.

### Testing Approach

Currently, this project doesn't have automated tests, but here's the recommended approach:

#### Unit Tests (Recommended: Vitest)

```typescript
// Example: hooks/useTasks.test.ts
import { renderHook } from '@testing-library/react';
import { useTasksQuery } from './useTasks';

describe('useTasksQuery', () => {
  it('should fetch tasks successfully', async () => {
    const { result } = renderHook(() => useTasksQuery({
      column: 'backlog',
    }));

    expect(result.current.data).toBeDefined();
  });
});
```

#### Component Tests (Recommended: React Testing Library)

```typescript
// Example: TaskCard.test.tsx
import { render, screen } from '@testing-library/react';
import TaskCard from './TaskCard';

describe('TaskCard', () => {
  it('should render task title', () => {
    render(<TaskCard task={{ id: '1', title: 'Test Task' }} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

#### E2E Tests (Recommended: Playwright)

```typescript
// Example: kanban.spec.ts
test('should create a new task', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Add Task');
  await page.fill('input[name=title]', 'New Task');
  await page.click('text=Create');
  await expect(page.locator('text=New Task')).toBeVisible();
});
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-priority-field

# Make changes and commit
git add .
git commit -m "feat: add priority field to tasks"

# Push and create PR
git push origin feature/add-priority-field
```

### Deployment

#### Production Build

```bash
# Build for production
npm run build

# Output directory: dist/
# Contains optimized, minified assets
```

#### Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] ESLint passes with no warnings
- [ ] Production build succeeds
- [ ] Environment variables configured
- [ ] API endpoint updated (from localhost to production)
- [ ] Test on multiple browsers
- [ ] Verify mobile responsiveness

#### Environment Variables

Create `.env` file for environment-specific config:

```env
VITE_API_URL=http://localhost:4000
VITE_APP_TITLE=Kanban Board
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL;
```

## Project Structure

```
MindLuster-Assessment/
├── dist/                         # Production build output
│   └── assets/                   # Built static assets (JS, CSS)
├── public/                       # Static assets
│   └── vite.svg                 # Public favicon/logo
├── src/                          # Source code
│   ├── components/
│   │   ├── Kanban/
│   │   │   ├── kanban-board/
│   │   │   │   ├── KanbanBoard.tsx      # Main board with DnD context
│   │   │   │   └── KanbanBoard.styles.ts # Styled components
│   │   │   ├── kanban-column/
│   │   │   │   ├── KanbanColumn.tsx      # Column with infinite scroll
│   │   │   │   └── KanbanColumn.styles.ts # Column styling
│   │   │   ├── task-card/
│   │   │   │   ├── TaskCard.tsx          # Draggable task card
│   │   │   │   └── TaskCard.styles.ts    # Card styling
│   │   │   ├── task-model/
│   │   │   │   ├── TaskModal.tsx         # Create/Edit modal
│   │   │   │   ├── DeleteDialog.tsx      # Delete confirmation dialog
│   │   │   │   └── TaskModal.styles.ts   # Modal styling
│   │   │   └── search-bar/
│   │   │       ├── SearchBar.tsx         # Debounced search input
│   │   │       └── SearchBar.styles.ts   # Search bar styling
│   │   └── Loader/
│   │       └── Loader.tsx               # Loading spinner component
│   ├── hooks/
│   │   └── useTasks.ts                  # React Query custom hooks for CRUD
│   ├── services/
│   │   └── api/
│   │       └── tasks.api.ts             # API client for CRUD operations
│   ├── types/
│   │   └── task.types.ts                # TypeScript type definitions
│   ├── utils/
│   │   ├── constants/
│   │   │   └── kanban.constants.ts      # Column definitions & app constants
│   │   ├── providers/
│   │   │   ├── react-query/
│   │   │   │   └── ReactQueryProvider.tsx # TanStack Query provider
│   │   │   ├── redux-provider/
│   │   │   │   └── ReduxProvider.tsx    # Redux store provider
│   │   │   └── theme-provider/
│   │   │       └── ThemeProvider.tsx    # Material-UI theme provider
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── search.slice.ts      # Search state management
│   │   │   │   └── ui.slice.ts          # UI state (modals, dialogs)
│   │   │   └── store.config.ts          # Redux store configuration
│   │   └── theme/
│   │       └── index.ts                 # Material-UI theme customization
│   ├── App.css                          # Global application styles
│   ├── App.tsx                          # Root component with providers
│   └── main.tsx                         # Application entry point
├── .gitignore                   # Git ignore rules
├── db.json                      # JSON Server mock database
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript root configuration
├── tsconfig.app.json           # TypeScript app configuration
├── tsconfig.node.json          # TypeScript node configuration
├── vite.config.ts              # Vite build configuration
└── README.md                   # Project documentation
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
