import { loginType } from "../../@types/auth";
import API from "../../axios"


export const loginUser=async(data:loginType)=>{
    try {
        let res=await API.post(`/auth/login`, data, {headers:{withCredentials:true}});
        console.log("API", API)
        return res.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}