import { FormikProvider, useFormik } from 'formik';
import { useMutation } from 'react-query';
import { Form, useNavigate } from 'react-router-dom';
import MyButton from '../../UI/Button';
import { changePassword } from '../../apis/auth';
import { registerValidation } from '../../validationSchema';
import { inputFields } from './RegisterComponent';
import { useEffect } from 'react';
import PrivateRoute from '../../pages/PrivateRoute';
import ContentWrapper from '../../contentWrapper/contentWrapper';

const PasswordChangeComponent = () => {
  const navigate = useNavigate();
  const {
    mutate: passwordChange,
    isSuccess,
    isLoading,
  } = useMutation(changePassword);

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
    },
    enableReinitialize: true,
    validationSchema: registerValidation,
    onSubmit: async (values: any) => {
      await passwordChange(values);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    if (isSuccess) {
      navigate('/home');
    }
  }, [isSuccess]);

  return (
    <>
      <PrivateRoute>
        <ContentWrapper>
          <div className="user-info">
            <div className="user-info-inputs">
              <FormikProvider value={formik}>
                <Form className="form" onSubmit={handleSubmit}>
                  <div className="input">
                    {inputFields(
                      true,
                      'old password',
                      'oldPassword',
                      'oldPassword',
                      true,
                      errors.oldPassword,
                      touched.oldPassword,
                      getFieldProps,
                    )}
                    {inputFields(
                      true,
                      'new password',
                      'password',
                      'password',
                      false,
                      errors.password,
                      touched.password,
                      getFieldProps,
                    )}

                    <MyButton
                      type="submit"
                      text="Change Password"
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
    </>
  );
};

export default PasswordChangeComponent;
