import type {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
} from "../../types/task.types";

export const tasksApi = {
  fetchAllTasks: async (search?: string): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (search) {
      params.append("q", search);
    }

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/tasks?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch all tasks");
    }

    return response.json();
  },

  createTask: async (taskData: CreateTaskDto): Promise<Task> => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`, {
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
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/tasks/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/tasks/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  },
};
