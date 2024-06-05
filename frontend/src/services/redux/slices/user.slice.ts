import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type userType = {
  userInfo: any;
  accessToken: string;
  refreshToken: string;
};
const initialState: userType = {
  userInfo: {},
  accessToken: '',
  refreshToken: '',
};
const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    storeUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = {};
      state.userInfo = action.payload;
    },
    storeAccessToken: (state, action: PayloadAction<any>) => {
      state.accessToken = '';
      state.accessToken = action.payload;
    },
    storeRefreshToken: (state, action: PayloadAction<any>) => {
      state.refreshToken = '';
      state.refreshToken = action.payload;
    },
  },
});

export const { storeUserInfo, storeAccessToken, storeRefreshToken } =
  userSlice.actions;

export const getUserInfo = (state: any) => state?.user?.userInfo;

export default userSlice.reducer;
