import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { tasksApi } from "../services/api/tasks.api";
import type {
  CreateTaskDto,
  Task,
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
    onMutate: async (newTaskData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks", "all"] });

      // Snapshot all previous query states
      const previousQueries = new Map();
      queryClient.getQueryCache().findAll({ queryKey: ["tasks", "all"] }).forEach(query => {
        previousQueries.set(query.queryKey, queryClient.getQueryData(query.queryKey));
      });

      // Create optimistic task with temporary ID
      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        ...newTaskData,
      };

      // Optimistically add the task to all queries
      queryClient.getQueryCache().findAll({ queryKey: ["tasks", "all"] }).forEach(query => {
        queryClient.setQueryData(query.queryKey, (old: Task[] | undefined) => {
          if (!old) return [optimisticTask];
          return [...old, optimisticTask];
        });
      });

      return { previousQueries };
    },
    onError: (_err, _newTaskData, context) => {
      // Rollback all queries on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Refetch to get the real task with server-generated ID
      queryClient.invalidateQueries({
        queryKey: ["tasks", "all"],
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: UpdateTaskDto) => tasksApi.updateTask(taskData),
    onMutate: async (updatedTask) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks", "all"] });

      // Snapshot all previous query states for rollback
      const previousQueries = new Map();
      queryClient.getQueryCache().findAll({ queryKey: ["tasks", "all"] }).forEach(query => {
        previousQueries.set(query.queryKey, queryClient.getQueryData(query.queryKey));
      });

      // Optimistically update all task queries
      queryClient.getQueryCache().findAll({ queryKey: ["tasks", "all"] }).forEach(query => {
        queryClient.setQueryData(query.queryKey, (old: Task[] | undefined) => {
          if (!old) return old;
          return old.map(task =>
            task.id === updatedTask.id
              ? { ...task, ...updatedTask }
              : task
          );
        });
      });

      return { previousQueries };
    },
    onError: (_err, _updatedTask, context) => {
      // Rollback all queries on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Refetch to ensure server state is in sync
      queryClient.invalidateQueries({
        queryKey: ["tasks", "all"],
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onMutate: async (deletedTaskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks", "all"] });

      // Snapshot all previous query states
      const previousQueries = new Map();
      queryClient.getQueryCache().findAll({ queryKey: ["tasks", "all"] }).forEach(query => {
        previousQueries.set(query.queryKey, queryClient.getQueryData(query.queryKey));
      });

      // Optimistically remove the task from all queries
      queryClient.getQueryCache().findAll({ queryKey: ["tasks", "all"] }).forEach(query => {
        queryClient.setQueryData(query.queryKey, (old: Task[] | undefined) => {
          if (!old) return old;
          return old.filter(task => task.id !== deletedTaskId);
        });
      });

      return { previousQueries };
    },
    onError: (_err, _deletedTaskId, context) => {
      // Rollback all queries on error
      if (context?.previousQueries) {
        context.previousQueries.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Refetch to ensure server state is in sync
      queryClient.invalidateQueries({
        queryKey: ["tasks", "all"],
      });
    },
  });
};

export const invalidateAllTasks = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["tasks", "all"] });
};
