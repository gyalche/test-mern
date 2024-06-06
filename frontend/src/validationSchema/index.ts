import * as Yup from 'yup';

export const registerValidation = Yup.object().shape({
  name: Yup.string()
    .min(3, 'must be 3 character')
    .max(20, 'cannot be more than 20 character'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('please enter password'),
});

export const addToDo = Yup.object().shape({
  title: Yup.string()
    .min(3, 'must be 3 character')
    .max(20, 'cannot be more than 20 character'),
  description: Yup.string()
    .min(10, 'Description must be atleast 10 character')
    .required('please enter password'),
  
});