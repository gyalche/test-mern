import toast from "react-hot-toast";
import API from "../../axios";

export const createTodoList = async (data: any) => {
    try {
        let res = await API.post(`/task/todo`, data, {
            headers: { withCredentials: true },
        });
        if (res.data.success) {
            toast.success(res.data?.message);
            return res.data;
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

//get all todo lists;
export const getTodoLists = async (data:any) => {
    const [_, priority, date, title]=data.queryKey;
    try {
        let res = await API.get(`/task/todo?priority=${priority}&date=${date}&title=${title}`, {
            headers: { withCredentials: true },
        });
        if (res.data.success) {
            return res.data;
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};