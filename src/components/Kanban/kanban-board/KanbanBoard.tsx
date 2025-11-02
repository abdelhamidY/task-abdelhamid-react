import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Typography from "@mui/material/Typography";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useAllTasks, useUpdateTask } from "../../../hooks/useTasks";
import type { Task } from "../../../types/task.types";
import { COLUMNS } from "../../../utils/constants/kanban.constants";
import { useAppSelector } from "../../../utils/store/store.config";
import KanbanColumn from "../kanban-column/KanbanColumn";
import SearchBar from "../search-bar/SearchBar";
import {
  StyledContainer,
  StyledGridBox,
  StyledHeaderBox,
} from "./KanbanBoard.styles";
import TaskCard from "../task-card/TaskCard";
import Loader from "../../Loader/Loader";

const TaskModal = lazy(() => import("../task-model/TaskModal"));

const KanbanBoard = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { mutate: updateTask } = useUpdateTask();
  const searchQuery = useAppSelector(state => state.search.query);

  const { data: allTasks = [], isLoading, isError } = useAllTasks(searchQuery);

  const tasksByColumn = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = allTasks.filter(task => task.column === column.id);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [allTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(active.data.current?.task || null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newColumn = over.id as Task["column"];
    const task = active.data.current?.task as Task;

    if (task && task.column !== newColumn) {
      updateTask({
        id: taskId,
        column: newColumn,
        oldColumn: task.column,
        title: task.title,
        description: task.description,
      });
    }

    setActiveTask(null);
  }, [updateTask]);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  return (
    <StyledContainer maxWidth={false}>
      <StyledHeaderBox>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Kanban Board
        </Typography>
        <SearchBar />
      </StyledHeaderBox>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <StyledGridBox>
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id] || []}
              isLoading={isLoading}
              isError={isError}
            />
          ))}
        </StyledGridBox>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <Suspense fallback={<Loader isLoading />}>
        <TaskModal />
      </Suspense>
    </StyledContainer>
  );
};

export default KanbanBoard;
