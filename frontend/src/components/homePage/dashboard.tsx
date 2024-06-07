import React, { useCallback, useEffect, useState } from 'react';
import { Button, Pagination, TextField } from '@mui/material';
import SelectComponent from '../../UI/Select';
import { selectPriority } from '../../constants';
import Datepicker from '../../UI/Datepicker';
import { AddTodo } from './addTodo';
import { deleteTodo, getTodoLists } from '../../apis/todos';
import { useMutation, useQuery } from 'react-query';
import { useDebounce } from '../../hooks/debounce';

import {
  getCompletedTaskList,
  removeIndividalTask,
  storTaskComplete,
} from '../../services/redux/slices/task.slice';
import { useDispatch, useSelector } from 'react-redux';
import { priorityColor } from '../../utils';
import { getUserInfo } from '../../services/redux/slices/user.slice';
import { getAllUsersData } from '../../apis/admin';
import DisplayTodo from './DisplayTodo';

const Dashboard = () => {
  const [priority, setPriority] = useState('');
  const [date, setDate] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [valueType, setValueType] = useState(1);
  const debouncedValue = useDebounce(search, 500);
  const todoListMemoize = useCallback(getTodoLists, []);
  const usersListMemoize = useCallback(getAllUsersData, []);

  const dispatch = useDispatch();
  const user = useSelector(getUserInfo);
  const taskCompleted = useSelector(getCompletedTaskList);
  const { mutate: deleteTodoData, isSuccess: deleteSuccess } =
    useMutation(deleteTodo);

  const completedTask = Array.from(
    new Set(taskCompleted?.map((data: any) => data?._id)),
  );

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  const handleOpen = (data: any) => {
    setOpen(true);
    setUpdateData(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data: todoData, refetch } = useQuery(
    ['todoLists', priority, date, debouncedValue, page],
    todoListMemoize,
  );
  const { data: allUsersData } = useQuery(
    ['allusers', date, debouncedValue, page],
    usersListMemoize,
    {
      enabled: user?.role === 'admin' ? true : false,
    },
  );

  useEffect(() => {
    refetch();
  }, [open, refetch, deleteSuccess, addTaskOpen]);

  return (
    <>
      {addTaskOpen && (
        <AddTodo open={addTaskOpen} close={() => setAddTaskOpen(false)} />
      )}
      {open && (
        <AddTodo
          open={open}
          close={handleClose}
          update={true}
          data={updateData}
        />
      )}
      <div className="main-todo">
        <div className="todo-add">
          <Button variant="contained" onClick={() => setAddTaskOpen(true)}>
            Add Task
          </Button>
        </div>
        <div className="search-filter">
          <TextField
            style={{ width: '200px' }}
            size="small"
            label={valueType === 2 ? 'search by name' : 'search task by title'}
            onChange={(e) => setSearch(e.target.value)}
          />
          {valueType !== 2 && (
            <SelectComponent
              value={priority}
              setValue={setPriority}
              data={selectPriority}
              label="Priority"
            />
          )}

          <Datepicker value={date} setValue={setDate} />
        </div>
        {user?.role === 'admin' && (
          <div className="user-task">
            <Button
              variant={valueType === 1 && 'contained'}
              onClick={() => setValueType(1)}
            >
              view all tasks
            </Button>
            <Button
              variant={valueType === 2 && 'contained'}
              onClick={() => setValueType(2)}
            >
              view all users
            </Button>
          </div>
        )}

        <div className="todo-list-data">
          {valueType === 1 &&
            todoData?.data?.map((data: any) => {
              const priority = data?.priority;
              const title = data?.title;
              const description = data?.description;
              const createdAt = new Date(data?.createdAt)
                .toDateString()
                .slice(0);
              const updatedAt = new Date(data?.updatedAt)
                .toDateString()
                .slice(0);
              return (
                <>
                  {/* <DisplayTodo data={data} /> */}

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
                        <i
                          style={{
                            color: 'gray',
                            fontSize: '13px',
                            minWidth: '60px',
                          }}
                        >
                          Created at:
                        </i>
                        <p style={{ fontSize: '13px' }}>{createdAt}</p>
                      </div>
                      <div className="create-update">
                        <i
                          style={{
                            color: 'gray',
                            fontSize: '13px',
                            minWidth: '60px',
                          }}
                        >
                          Updated at:
                        </i>
                        <p style={{ fontSize: '13px' }}>{updatedAt}</p>
                      </div>
                    </div>
                    {completedTask?.includes(data?._id) ? (
                      <>
                        {location.pathname === '/task-completed' ? (
                          <div className="add-incomplete">
                            <button
                              onClick={() =>
                                dispatch(removeIndividalTask(data?._id))
                              }
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
                        <button
                          onClick={() => dispatch(storTaskComplete(data))}
                        >
                          Add to completed
                        </button>
                      </div>
                    )}

                    <div className="update-delete">
                      {location.pathname === '/task-completed' ? (
                        <div
                          className="update-complete"
                          style={{ minWidth: '300px' }}
                        />
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
                            <button onClick={() => deleteTodoData(data?._id)}>
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          {valueType === 2 &&
            allUsersData?.data?.map((data: any) => (
              <DisplayTodo data={data} type="admin" />
            ))}

          {valueType === 1
            ? todoData?.data.length === 0 && (
                <div>
                  <h1>NO TASK CREATED</h1>
                </div>
              )
            : allUsersData?.length === 0 && (
                <div>
                  <h1>NO USER FOUND</h1>
                </div>
              )}

          <div className="pagination">
            <Pagination
              count={
                valueType === 1
                  ? todoData?.totalPage
                    ? todoData?.totalPage
                    : 1
                  : valueType === 2 && allUsersData?.totalPage
                    ? allUsersData?.totalPage
                    : 1
              }
              page={page}
              size="small"
              onChange={handlePagination}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
