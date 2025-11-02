import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { tasksApi } from "../services/api/tasks.api";
import type {
  CreateTaskDto,
  UpdateTaskDto,
} from "../types/task.types";

export const taskKeys = {
  all: (search?: string) => ["tasks", "all", search] as const,
};

export const useAllTasks = (search?: string) => {
  return useQuery({
    queryKey: taskKeys.all(search),
    queryFn: () => tasksApi.fetchAllTasks(search),
    enabled: true,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskDto) => tasksApi.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "all"],
        refetchType: "all",
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: UpdateTaskDto) => tasksApi.updateTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "all"],
        refetchType: "all",
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", "all"],
        refetchType: "all",
      });
    },
  });
};

export const invalidateAllTasks = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["tasks", "all"] });
};
