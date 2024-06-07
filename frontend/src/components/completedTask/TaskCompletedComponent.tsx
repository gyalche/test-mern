import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCompletedTaskList } from '../../services/redux/slices/task.slice';
import DisplayTodo from '../homePage/DisplayTodo';
import { useNavigate } from 'react-router-dom';

const TaskCompletedComponent = () => {
  const taskCompleted = useSelector(getCompletedTaskList);
  const navigate = useNavigate();
  useEffect(() => {
    if (!taskCompleted.length) {
      setTimeout(() => {
        navigate(-1);
      }, 500);
    }
  }, [taskCompleted]);
  return (
    <div>
      <div className="todo-list-data">
        {taskCompleted.length ? (
          taskCompleted?.map((data: any) => <DisplayTodo data={data} />)
        ) : (
          <div>NO COMPLETED TASK</div>
        )}
      </div>
    </div>
  );
};

export default TaskCompletedComponent;
