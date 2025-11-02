import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../../types/task.types';

interface UiState {
  isTaskModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedTask: Task | null;
  taskToDelete: string | null;
}

const initialState: UiState = {
  isTaskModalOpen: false,
  isDeleteDialogOpen: false,
  selectedTask: null,
  taskToDelete: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTaskModal: (state, action: PayloadAction<Task | null>) => {
      state.isTaskModalOpen = true;
      state.selectedTask = action.payload;
    },
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.selectedTask = null;
    },
    openDeleteDialog: (state, action: PayloadAction<string>) => {
      state.isDeleteDialogOpen = true;
      state.taskToDelete = action.payload;
    },
    closeDeleteDialog: (state) => {
      state.isDeleteDialogOpen = false;
      state.taskToDelete = null;
    },
  },
});

export const {
  openTaskModal,
  closeTaskModal,
  openDeleteDialog,
  closeDeleteDialog,
} = uiSlice.actions;
export default uiSlice.reducer;
