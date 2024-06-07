import React, { useState } from 'react';
import {
  getCompletedTaskList,
  removeIndividalTask,
  storTaskComplete,
} from '../../services/redux/slices/task.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AddTodo } from './addTodo';
import { useMutation } from 'react-query';
import { deleteTodo } from '../../apis/todos';

export const priorityColor = (priority: 'low' | 'high' | 'medium') => {
  const priorityColor =
    priority === 'low' ? 'gray' : priority === 'high' ? '#ea3f3f' : 'green';
  return (
    <span
      className="priority"
      style={{ backgroundColor: `${priorityColor}`, borderRadius: '5px' }}
    >
      {' '}
      {priority}
    </span>
  );
};
const DisplayTodo = (data: any) => {
  const [open, setOpen] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const priority = data?.data?.priority;
  const title = data?.data?.title;
  const description = data?.data?.description;
  const createdAt = new Date(data?.data?.createdAt).toDateString().slice(0);
  const updatedAt = new Date(data?.data?.updatedAt).toDateString().slice(0);

  const location = useLocation();
  const dispatch = useDispatch();
  const taskCompleted = useSelector(getCompletedTaskList);

  const completedTask = Array.from(
    new Set(taskCompleted?.map((data: any) => data?._id)),
  );
  const handleOpen = (data: any) => {
    setOpen(true);
    setUpdateData(data?.data);
  };
  
  const { mutate: deleteTodoData, isLoading: deleteLoading } =
    useMutation(deleteTodo);
  const close = () => {
    setOpen(false);
  };
  return (
    <>
      {open && (
        <AddTodo open={open} close={close} update={true} data={updateData} />
      )}
      <div className="mytodos">
        <div className="title-priority">
          <p>{title}</p>
          {priorityColor(priority)}
        </div>
        <div className="description">
          {/**description */}
          <p>
            {description?.slice(0, 200)}
            {description?.length > 200 && <p>...</p>}
          </p>
        </div>
        <div>
          {/*created and updated and proirity*/}
          <div className="create-update">
            <i style={{ color: 'gray', fontSize: '13px' }}>Created at:</i>
            <p style={{ fontSize: '13px' }}>{createdAt}</p>
          </div>
          <div className="create-update">
            <i style={{ color: 'gray', fontSize: '13px' }}>Updated at:</i>
            <p style={{ fontSize: '13px' }}>{updatedAt}</p>
          </div>
        </div>
        {completedTask?.includes(data?.data?._id) ? (
          <>
            {location.pathname === '/task-completed' ? (
              <div className="add-incomplete">
                <button
                  onClick={() => dispatch(removeIndividalTask(data?.data?._id))}
                >
                  Make it incomplete
                </button>
              </div>
            ) : (
              <div className="complete">
                <button>Task completed</button>
              </div>
            )}
          </>
        ) : (
          <div className="add-complete">
            <button onClick={() => dispatch(storTaskComplete(data?.data))}>
              Add to completed
            </button>
          </div>
        )}

        <div className="update-delete">
          {location.pathname === '/task-completed' ? (
            <div className="update-complete" style={{ minWidth: '300px' }} />
          ) : (
            <>
              <div className="update-complete">
                <button
                  onClick={() => {
                    handleOpen(data);
                  }}
                >
                  Update
                </button>
              </div>

              <div className="delete-complete">
                <button onClick={() => deleteTodoData(data?.data?._id)}>
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayTodo;
