//custom hooks
import { Form, FormikProvider, useFormik } from 'formik';
import { InputComponent } from '../../UI/InputComponent';
import MyButton from '../../UI/Button';
import { useMutation } from 'react-query';
import { loginUser } from '../../apis/auth/login';


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

  const {
    mutate: loginMutation,
    isSuccess,
    error,
    isPending,
    status,
    data: userData,
  } = useMutation('login-user', loginUser);


  console.log("check", isSuccess)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    enableReinitialize: true,
    onSubmit: async (values: any) => {
     await loginMutation(values)
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
  } = formik;

  return (
    <div className="container">
      <div className="heading">
        <h1>WELCOME TO LOGIN</h1>
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
              errors.name,
              touched.name,
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
              isLoading={false}
              variant="contained"
            />
          </div>
          <div className="passwordForgot">
            <p>Forgot Password?</p>
            <span style={{ cursor: 'pointer', color: 'blue' }}>
              click here to reset.
            </span>
          </div>
          <div className="createAccount">
            <p style={{textDecoration:'underline', cursor:'pointer'}}>
              Click here to <span>Create Account</span>
            </p>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default LoginComponent;
