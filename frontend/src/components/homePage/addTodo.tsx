import { Modal } from '@mui/material';
import { wrongIcon } from '../../assets/icons';
import { FormikProvider, useFormik } from 'formik';
import { Form } from 'react-router-dom';
import { optModelOpen } from '../../@types/auth';
import MyButton from '../../UI/Button';
import { inputFields } from '../auth/RegisterComponent';
import SelectComponent from '../../UI/Select';
import { selectPriority } from '../../constants';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { createTodoList } from '../../apis/todos';
import { addToDo } from '../../validationSchema';

export const AddTodo = ({ open, close }: optModelOpen) => {
 const [priority, setPriority] = useState('high');

   const {
     mutate: addToDoTask,
     isSuccess
   } = useMutation('create-todo', createTodoList);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    enableReinitialize: true,
    validationSchema: addToDo,
    onSubmit: async (values: any) => {
      const val = { ...values };
      val.priority = priority;
      await addToDoTask(val);
      console.log('values', val);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  useEffect(()=>{
    if(isSuccess){
      close()
    }
  },[isSuccess])
  console.log("isSuccess", isSuccess)
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="todo-modal">
        <div style={{ textAlign: 'end' }}>
          <p onClick={close} style={{ cursor: 'pointer' }}>
            {wrongIcon}
          </p>
        </div>
        <FormikProvider value={formik}>
          <Form className="form" onSubmit={handleSubmit}>
            <div className="input">
              {inputFields(
                true,
                'title',
                'title',
                'title',
                true,
                errors.title,
                touched.title,
                getFieldProps,
              )}
              {inputFields(
                true,
                'description',
                'description',
                'description',
                false,
                errors.description,
                touched.description,
                getFieldProps,
              )}
              <SelectComponent
                value={priority}
                setValue={setPriority}
                data={selectPriority}
                label="Select Priority"
                width={500}
              />

              <MyButton
                type="submit"
                text="Add todo task"
                // isLoading={isLoading}
                variant="contained"
              />
            </div>
          </Form>
        </FormikProvider>
      </div>
    </Modal>
  );
};
