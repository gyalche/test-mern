import toast from 'react-hot-toast';
import { loginType, resetPasswordType } from '../../@types/auth';
import API from '../../axios';

//login;
export const loginUser = async (data: loginType) => {
  try {
    let res = await API.post(`/auth/login`, data, {
      headers: { withCredentials: true },
    });
    if (res.data.success) {
      toast.success('Login successfully');
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    sessionStorage.clear();
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

//register;
export const registerUser = async (data: loginType) => {
  try {
    let res = await API.post(`/auth/register`, data, {
      headers: { withCredentials: true },
    });
    if (res.data.success) {
      toast.success('Enter opt to activate account');
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error(error.response?.data?.message || 'Register failed');
  }
};

//verify otp;
export const activateAccount = async (data: string) => {
  const token = sessionStorage.getItem('account_activation_token');
  const value = {
    token,
    activation_code: data,
  };
  try {
    const res = await API.post(`/auth/activate`, value);
    if (res.data.success) {
      toast.success('Account verified');
      sessionStorage.removeItem('account_activation_token');
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error(error?.response?.data?.message);
  }
};
//send mail to recover password;

export const sendMailRecoverPassword = async (body: string) => {
  try {
    let res = await API.post(`/auth/forgot-password`, { email: body });
    if (res.data.success) {
      toast.success(res.data.message);
      sessionStorage.setItem('reset-password', res?.data?.token);
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw new Error(error.response?.data?.message);
  }
};

export const resetPasswordWithOtp = async (body: resetPasswordType) => {
  try {
    let res = await API.put(`/auth/update-password`, body);
    if (res.data.success) {
      toast.success(res.data.message);
      sessionStorage.clear();
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message);
    throw new Error(error.response?.data?.message || 'failed to reset');
  }
};

//refresh token;
export const newAccessTokenGenerate = async (data: any) => {
  try {
    let res = await API.post(`/auth/refresh-token`, data);
    if (res.data.success) {
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error(error.response?.data?.message);
  }
};

//upload photo;
export const uploadPhoto = async (data: any) => {
  try {
    let res = await API.patch(`/auth/upload-photo`, { profile: data });
    if (res.data.success) {
      toast.success(res.data.message);
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error(error.response?.data?.message);
  }
};

//update user;
export const updateUser = async (data: any) => {
  try {
    let res = await API.put(`/auth/update-user`, data);
    if (res.data.success) {
      toast.success(res.data.message);
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error(error.response?.data?.message);
  }
};

//change password;
export const changePassword = async (data: any) => {
  try {
    let res = await API.patch(`/auth/change-password`, data);
    if (res.data.success) {
      toast.success(res.data.message);
      return res.data;
    }
  } catch (error: any) {
    toast.error(error.response.data.message);
    throw new Error(error.response?.data?.message);
  }
};
