import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import type { Task } from "../../../types/task.types";
import {
  openDeleteDialog,
  openTaskModal,
} from "../../../utils/store/slices/ui.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../utils/store/store.config";
import {
  StyledActionButtons,
  StyledCard,
  StyledCardContent,
  StyledContentWrapper,
  StyledDescription,
  StyledHighlight,
  StyledTitle,
} from "./TaskCard.styles";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const TaskCard = ({ task, isDragging = false }: TaskCardProps) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.search.query);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isBeingDragged ? 0.5 : 1,
    cursor: isBeingDragged ? "grabbing" : "grab",
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openTaskModal(task));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openDeleteDialog(task.id));
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <StyledHighlight key={index}>{part}</StyledHighlight>
      ) : (
        part
      )
    );
  };

  return (
    <StyledCard
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      elevation={isDragging ? 8 : 1}
      $isDragging={isDragging}
    >
      <StyledCardContent>
        <StyledActionButtons
          direction="row"
          spacing={0.5}
          className="action-buttons"
        >
          <IconButton size="small" onClick={handleEdit} color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleDelete} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </StyledActionButtons>

        <StyledContentWrapper>
          <StyledTitle variant="subtitle1" fontWeight="600" gutterBottom>
            {highlightText(task.title)}
          </StyledTitle>
          <StyledDescription variant="body2" color="text.secondary">
            {highlightText(task.description)}
          </StyledDescription>
        </StyledContentWrapper>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TaskCard;
