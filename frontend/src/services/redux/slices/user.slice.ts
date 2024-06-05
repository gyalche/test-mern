import { createSlice } from '@reduxjs/toolkit';

type userType={
    userInfo:any;
    accessToken:string;
    refreshToken:string;
}
const initialState: userType = {
    userInfo:{},
    accessToken:'',
    refreshToken:''
}
const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
       
    },
})



export default userSlice.reducer