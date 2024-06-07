import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slices/user.slice';
import taskSlice from './slices/task.slice';

const rootReducer = combineReducers({
  user: userSlice,
  task: taskSlice,
});

export default rootReducer;
