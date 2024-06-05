import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './slices/user.slice';


const rootReducer = combineReducers({
    spell: userSlice,
});

export default rootReducer;