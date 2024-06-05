import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import MyButton from '../../UI/Button';
import { InputComponent } from '../../UI/InputComponent';
import { Form } from 'react-router-dom';
import { checkIcon, wrongIcon } from '../../assets/icons';
import { registerUser } from '../../apis/auth';
import { useMutation } from 'react-query';
import { registerValidation } from '../../validationSchema';
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
const RegisterComponent = () => {
  const [adminSecret, setAdminSecret] = useState('');
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const {
    mutate: registerMutation,
    isSuccess,
    isLoading,
    data,
  } = useMutation('register', registerUser);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
    enableReinitialize: true,
    validationSchema: registerValidation,
    onSubmit: async (values: any) => {
      const val = { ...values };
      if (adminSecret === `${import.meta.env.VITE_ADMIN_SECRET}`) {
        val.role = 'admin';
      } else {
        val.role = 'user';
      }
      await registerMutation(val);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    if (isSuccess) {
      sessionStorage.setItem('account_activation_token', data?.activationToken);
      setOpen(true);
    }
  }, [isSuccess]);

  return (
    <>
      {isSuccess && <OtpModal type={1} open={open} close={handleClose} />}
      <div className="container">
        <div className="heading">
          <h1>Register you account here</h1>
        </div>

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
              {inputFields(
                true,
                'password',
                'password',
                'password',
                false,
                errors.password,
                touched.password,
                getFieldProps,
              )}

              <div className="admin-create">
                <p>For admin account create?</p>
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
                text="Register your account"
                isLoading={isLoading}
                variant="contained"
              />
            </div>
          </Form>
        </FormikProvider>
      </div>
    </>
  );
};

export default RegisterComponent;
