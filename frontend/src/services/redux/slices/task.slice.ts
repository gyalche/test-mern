import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type userType = {
  taskCompletedList: Array<any>;
  updateFetch: boolean;
};
const initialState: userType = {
  taskCompletedList: [],
  updateFetch: false,
};
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    storTaskComplete: (state, action: PayloadAction<any>) => {
      state.taskCompletedList.push(action.payload);
    },
    removeIndividalTask: (state, action: PayloadAction<any>) => {
      const index = state.taskCompletedList.findIndex(
        (idx) => idx?._id === action.payload,
      );
      state.taskCompletedList.splice(index, 1);
    },
    setUpdateFetch: (state, action: PayloadAction<boolean>) => {
      state.updateFetch = action.payload;
    },
  },
});

export const { storTaskComplete, removeIndividalTask, setUpdateFetch } =
  taskSlice.actions;

export const getCompletedTaskList = (state: any) =>
  state?.task?.taskCompletedList;
export const getUpdateFetch = (state: any) => state?.task.updateFetch;
export default taskSlice.reducer;
