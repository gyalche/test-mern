import toast from 'react-hot-toast';
import API from '../../axios';

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
    toast.error(error.response?.data?.message);
    throw new Error(error.response?.data?.message);
  }
};

//get all todo lists;
export const getTodoLists = async (data: any) => {
  const [, priority, date, title, page] = data.queryKey;
  try {
    let res = await API.get(
      `/task/todo?priority=${priority}&date=${date}&title=${title}&page=${page}`,
      {
        headers: { withCredentials: true },
      },
    );
    if (res.data.success) {
      return res.data;
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};

//update todos;
export const updateTodo = async ({ id, body }: any) => {
  try {
    let res = await API.put(`/task/todo/${id}`, body, {
      headers: { withCredentials: true },
    });
    if (res.data.success) {
      toast.success(res.data.message);
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw new Error(error.response?.data?.message || 'update failed');
  }
};

//delete todo;
export const deleteTodo = async (id: string) => {
  try {
    let res = await API.delete(`/task/todo/${id}`, {
      headers: { withCredentials: true },
    });
    if (res.data.success) {
      toast.success(res.data.message);
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw new Error(error.response?.data?.message);
  }
};
