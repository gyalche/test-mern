import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MyButton from '../../UI/Button';
import { InputComponent } from '../../UI/InputComponent';
import { loginUser } from '../../apis/auth';
import {
  storeAccessToken,
  storeRefreshToken,
  storeUserInfo
} from '../../services/redux/slices/user.slice';
import { OtpModal } from '../otpModal';

const inputFields = (
  required: boolean,
  label: string,
  getFieldPropsValue: string,
  type: any,
  autoFocus: boolean,
  errors: any,
  touched: any,
  getFieldProps: any,
) => (
  <InputComponent
    required={required}
    label={label}
    getFieldPropsValue={getFieldPropsValue}
    type={type}
    autoFocus={autoFocus}
    errors={errors}
    touched={touched}
    getFieldProps={getFieldProps}
  />
);

const LoginComponent = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(0);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const forgotPassword = () => {
    setOpen(true);
    setType(2);
  };
  const {
    mutate: loginMutation,
    isSuccess,
    isLoading,
    data: userData,
  } = useMutation('login-user', loginUser);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      await loginMutation(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    if(isSuccess){
        dispatch(storeUserInfo(userData?.data));
        dispatch(storeAccessToken(userData?.access_token));
        dispatch(storeRefreshToken(userData?.refresh_token));
        navigate('/home');
    }
  }, [isSuccess]);

  
  return (
    <>
      {open && <OtpModal type={type} open={open} close={handleClose} />}
      <div className="container">
        <div className="heading">
          <h1>LOGIN</h1>
        </div>
        <FormikProvider value={formik}>
          <Form className="form" onSubmit={handleSubmit}>
            <div className="input">
              {inputFields(
                true,
                'email',
                'email',
                'email',
                true,
                errors.email,
                touched.email,
                getFieldProps,
              )}
              {inputFields(
                true,
                'Password',
                'password',
                'password',
                false,
                errors.password,
                touched.password,
                getFieldProps,
              )}
              <MyButton
                type="submit"
                text="Login"
                isLoading={isLoading}
                variant="contained"
              />
            </div>
            <div className="passwordForgot">
              <p>Forgot Password?</p>
              <span
                onClick={() => forgotPassword()}
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                click here to reset.
              </span>
            </div>
            <div className="createAccount">
              <p
                onClick={() => navigate('/register')}
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                Click here to Create Account
              </p>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </>
  );
};

export default LoginComponent;
