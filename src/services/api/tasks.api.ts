import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  ColumnStatus,
} from "../../types/task.types";
import {
  API_BASE_URL,
  TASKS_PER_PAGE,
} from "../../utils/constants/kanban.constants";

interface FetchTasksParams {
  column: ColumnStatus;
  page: number;
  search?: string;
}

interface FetchTasksResponse {
  tasks: Task[];
  hasMore: boolean;
  total: number;
}

export const tasksApi = {
  fetchTasks: async ({
    column,
    page,
    search,
  }: FetchTasksParams): Promise<FetchTasksResponse> => {
    const params = new URLSearchParams();
    params.append("column", column);
    params.append("_page", page.toString());
    params.append("_limit", TASKS_PER_PAGE.toString());

    if (search) {
      params.append("q", search);
    }

    const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks: Task[] = await response.json();

    const totalCount = response.headers.get("x-total-count");
    const total = totalCount ? parseInt(totalCount, 10) : tasks.length;

    const hasMore = page * TASKS_PER_PAGE < total;

    return { tasks, hasMore, total };
  },

  fetchAllTasks: async (search?: string): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (search) {
      params.append("q", search);
    }

    const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch all tasks");
    }

    return response.json();
  },

  fetchTasksByColumn: async (
    column: ColumnStatus,
    search?: string
  ): Promise<Task[]> => {
    const params = new URLSearchParams();
    params.append("column", column);
    if (search) {
      params.append("q", search);
    }

    const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks by column");
    }

    return response.json();
  },

  createTask: async (taskData: CreateTaskDto): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...taskData,
        id: Date.now().toString(), // Generate unique ID
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return response.json();
  },

  updateTask: async ({ id, ...updates }: UpdateTaskDto): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }

    return response.json();
  },
};
