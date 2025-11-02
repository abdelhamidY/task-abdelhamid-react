import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { Column, Task } from "../../../types/task.types";
import { useAppDispatch } from "../../../utils/store/store.config";
import { openTaskModal } from "../../../utils/store/slices/ui.slice";
import { StyledAddButton, StyledCountBadge, StyledEmptyState, StyledHeader, StyledHeaderStack, StyledLoadingBox, StyledPaper, StyledTasksList } from "./KanbanColumn.styles";
import TaskCard from "../task-card/TaskCard";


interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
}

const KanbanColumn = ({ column, tasks, isLoading, isError }: KanbanColumnProps) => {
  const dispatch = useAppDispatch();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const totalCount = tasks.length;

  const handleAddTask = () => {
    dispatch(
      openTaskModal({
        id: "",
        title: "",
        description: "",
        column: column.id,
      })
    );
  };

  return (
    <StyledPaper
      ref={setNodeRef}
      elevation={2}
      $isOver={isOver}
      $borderColor={column.color}
    >
      <StyledHeader>
        <StyledHeaderStack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="600">
            {column.title}
          </Typography>
          <StyledCountBadge $color={column.color}>
            {totalCount}
          </StyledCountBadge>
        </StyledHeaderStack>
        <StyledAddButton
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
          size="small"
        >
          Add Task
        </StyledAddButton>
      </StyledHeader>

      <StyledTasksList>
        {isLoading && (
          <StyledLoadingBox>
            <CircularProgress size={32} />
          </StyledLoadingBox>
        )}

        {isError && (
          <Typography color="error" align="center">
            Error loading tasks
          </Typography>
        )}

        {!isLoading && tasks.length === 0 && (
          <StyledEmptyState>
            <Typography variant="body2">No tasks yet</Typography>
            <Typography variant="caption">
              Click "Add Task" to create one
            </Typography>
          </StyledEmptyState>
        )}

        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </StyledTasksList>
    </StyledPaper>
  );
};

export default KanbanColumn;
