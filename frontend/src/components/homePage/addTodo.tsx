import { Modal } from '@mui/material';
import { wrongIcon } from '../../assets/icons';
import { FormikProvider, useFormik } from 'formik';
import { Form } from 'react-router-dom';
import MyButton from '../../UI/Button';
import { inputFields } from '../auth/RegisterComponent';
import SelectComponent from '../../UI/Select';
import { selectPriority } from '../../constants';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { createTodoList, updateTodo } from '../../apis/todos';
import { addToDo } from '../../validationSchema';
import { todosType } from '../../@types/auth';

export const AddTodo = ({ open, close, update, data,  }: todosType) => {
  const [priority, setPriority] = useState(update ? data?.priority : 'high');


  const { mutate: addToDoTask, isSuccess } = useMutation(
    'create-todo',
    createTodoList,
  );

  const { mutate: updateTodoData, isSuccess: updateSuccess } = useMutation(
    'update-todo',
    updateTodo,
  );

  const formik = useFormik({
    initialValues: {
      title: update ? data?.title : '',
      description: update ? data?.description : '',
    },
    enableReinitialize: true,
    validationSchema: addToDo,
    onSubmit: async (values: any) => {
      const val = { ...values };
      val.priority = priority;
      if (update) {
        await updateTodoData({ id: data?._id, body: val });
         
      } else {
        await addToDoTask(val);
        console.log('values', val);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  useEffect(() => {
    if (isSuccess || updateSuccess) {
      close();
    }
  }, [close, isSuccess, updateSuccess]);
  console.log('isSuccess', updateSuccess);
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
            <div className="input todoField">
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
                text={update ? 'update ' : 'Add todo task'}
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
