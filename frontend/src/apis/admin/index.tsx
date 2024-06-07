import API from '../../axios';

export const getAllUsersData = async (data: any) => {
  const [, date, title, page] = data.queryKey;
  try {
    let res = await API.get(
      `/admin/users?date=${date}&name=${title}&page=${page}`,
      {
        headers: { withCredentials: true },
      },
    );
    if (res?.data.success) {
      return res?.data;
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message);
  }
};
