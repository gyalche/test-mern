import React, { useEffect, useRef, useState } from 'react';
import PrivateRoute from '../../pages/PrivateRoute';
import ContentWrapper from '../../contentWrapper/contentWrapper';
import { updateValidation } from '../../validationSchema';
import { FormikProvider, useFormik } from 'formik';
import { Form, useNavigate } from 'react-router-dom';
import MyButton from '../../UI/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserInfo,
  storeUserInfo,
} from '../../services/redux/slices/user.slice';
import { checkIcon, wrongIcon } from '../../assets/icons';
import { Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { inputFields } from './RegisterComponent';
import { useMutation } from 'react-query';
import { updateUser, uploadPhoto } from '../../apis/auth';
import { useFileReader } from '../../hooks/fileReader';

const UserDetails = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [upload, setUpload] = useState(false);
  const ref = useRef(null);
  const user = useSelector(getUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //file reader custom hook;
  const { file, readFile } = useFileReader();
  const {
    mutate: uploadProfile,
    data: userUpdateProfile,
    isLoading: profileLoading,
    isSuccess: profileUplaodSuccess,
  } = useMutation(uploadPhoto);
  const {
    mutate: updateAccount,
    data: updatedData,
    isLoading,
    isSuccess: userUpdateSuccess,
  } = useMutation(updateUser);

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: 'user',
    },
    enableReinitialize: true,
    validationSchema: updateValidation,
    onSubmit: async (values: any) => {
      const val = { ...values };
      if (adminSecret === `${import.meta.env.VITE_ADMIN_SECRET}`) {
        val.role = 'admin';
      } else {
        val.role = 'user';
      }
      await updateAccount(val);
    },
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handeImageChange = (e: any) => {
    const image = e.target.files[0];
    if (image) {
      readFile(image);
      setUpload(true);
    }
  };

  const handleProfileClick = () => {
    if (ref?.current) {
      ref.current?.click();
    }
  };

  useEffect(() => {
    if (file && upload) {
      uploadProfile(file);
      setUpload(false);
    }
    if (profileUplaodSuccess) {
      dispatch(storeUserInfo(userUpdateProfile?.data));
    }
    if (userUpdateSuccess) {
      dispatch(storeUserInfo(updatedData?.data));
      setTimeout(() => {
        navigate('/home');
      }, 500);
    }
  }, [file, profileUplaodSuccess, userUpdateSuccess]);

  return (
    <PrivateRoute>
      <ContentWrapper>
        <div className="user-info">
          <div className="user-info-inputs">
            <div className="user-info-profile">
              <div className="user-profile">
                <div className="add-profile" onClick={handleProfileClick}>
                  <EditIcon sx={{ height: '20px' }} />
                </div>
                {!user.profile?.url ? (
                  <>
                    <p style={{ fontSize: '30px' }}>
                      {user?.name[0].toUpperCase()}
                    </p>
                  </>
                ) : (
                  <Avatar
                    alt="Remy Sharp"
                    src={user?.profile?.url}
                    style={{
                      objectFit: 'contain',
                      height: '100%',
                      width: '100%',
                    }}
                  />
                )}
              </div>
            </div>
            {profileLoading && (
              <p style={{ width: '100&', textAlign: 'center', color: 'gray' }}>
                Uploading...
              </p>
            )}
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={handeImageChange}
              ref={ref}
            />
            <FormikProvider value={formik}>
              <Form className="form" onSubmit={handleSubmit}>
                <div className="input">
                  {inputFields(
                    true,
                    'name',
                    'name',
                    'name',
                    true,
                    errors.name,
                    touched.name,
                    getFieldProps,
                  )}
                  {inputFields(
                    true,
                    'email',
                    'email',
                    'email',
                    false,
                    errors.email,
                    touched.email,
                    getFieldProps,
                  )}
                  <div className="admin-create">
                    <p>Enter admin secret key. Otherwise you will be user.</p>
                    <div className="key_input">
                      <input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setAdminSecret(e.target.value);
                        }}
                        maxLength={4}
                        style={{ fontSize: '12px' }}
                        placeholder="enter admin secret key"
                      />
                      {adminSecret === `${import.meta.env.VITE_ADMIN_SECRET}`
                        ? checkIcon
                        : adminSecret.length
                          ? wrongIcon
                          : ''}
                    </div>
                  </div>
                  <MyButton
                    type="submit"
                    text="Update account"
                    isLoading={isLoading}
                    variant="contained"
                  />
                </div>
              </Form>
            </FormikProvider>
          </div>
        </div>
      </ContentWrapper>
    </PrivateRoute>
  );
};

export default UserDetails;
