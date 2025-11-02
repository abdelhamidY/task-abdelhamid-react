import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/store/store.config";
import type { ColumnStatus } from "../../../types/task.types";
import { useCreateTask, useDeleteTask, useUpdateTask } from "../../../hooks/useTasks";
import { closeDeleteDialog, closeTaskModal } from "../../../utils/store/slices/ui.slice";
import { StyledAlert, StyledContentStack, StyledDialogActions, StyledDialogPaper, StyledDialogTitle } from "./TaskModal.styles";
import { COLUMNS } from "../../../utils/constants/kanban.constants";

const TaskModal = () => {
  const dispatch = useAppDispatch();
  const { isTaskModalOpen, selectedTask, isDeleteDialogOpen, taskToDelete } =
    useAppSelector(state => state.ui);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<ColumnStatus>("backlog");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const isEditMode = !!selectedTask?.id;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setColumn(selectedTask.column);
    } else {
      setTitle("");
      setDescription("");
      setColumn("backlog");
    }
    setErrors({});
  }, [selectedTask, isTaskModalOpen]);

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditMode) {
      updateTask(
        {
          id: selectedTask.id,
          title: title.trim(),
          description: description.trim(),
          column,
        },
        {
          onSuccess: () => {
            dispatch(closeTaskModal());
          },
        }
      );
    } else {
      createTask(
        {
          title: title.trim(),
          description: description.trim(),
          column,
        },
        {
          onSuccess: () => {
            dispatch(closeTaskModal());
          },
        }
      );
    }
  };

  const handleClose = () => {
    dispatch(closeTaskModal());
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete, {
        onSuccess: () => {
          dispatch(closeDeleteDialog());
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    dispatch(closeDeleteDialog());
  };

  return (
    <>
      <Dialog
        open={isTaskModalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: StyledDialogPaper,
        }}
      >
        <StyledDialogTitle>
          {isEditMode ? "Edit Task" : "Create New Task"}
        </StyledDialogTitle>
        <DialogContent>
          <StyledContentStack spacing={3}>
            <TextField
              autoFocus
              label="Title"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter task title"
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Enter task description"
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={column}
                label="Status"
                onChange={e => setColumn(e.target.value as ColumnStatus)}
              >
                {COLUMNS.map(col => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </StyledContentStack>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isPending}
          >
            {isPending ? "Saving..." : isEditMode ? "Update" : "Create"}
          </Button>
        </StyledDialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <StyledDialogTitle>Delete Task</StyledDialogTitle>
        <DialogContent>
          <StyledAlert severity="warning">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </StyledAlert>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default TaskModal;
