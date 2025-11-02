import type { Column } from "../../types/task.types";

export const COLUMNS: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    color: "#64748b",
  },
  {
    id: "in_progress",
    title: "In Progress",
    color: "#3b82f6",
  },
  {
    id: "review",
    title: "Review",
    color: "#f59e0b",
  },
  {
    id: "done",
    title: "Done",
    color: "#10b981",
  },
];

export const TASKS_PER_PAGE = 10;

export const SEARCH_DEBOUNCE_MS = 300;
