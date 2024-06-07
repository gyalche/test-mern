import {
  getCompletedTaskList,
  removeIndividalTask,
  storTaskComplete,
} from '../../services/redux/slices/task.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

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
  const priority = data?.data?.priority;
  const title = data?.data?.title;
  const description = data?.data?.description;
  const createdAt = new Date(data?.data?.createdAt).toDateString().slice(0);
  const updatedAt = new Date(data?.data?.updatedAt).toDateString().slice(0);

  //for admin
  const type = data?.type;
  const name = data?.data?.name;
  const profile = data?.data?.profile?.url;
  const email = data?.data?.email;
  const role = data?.data?.role;
  const location = useLocation();
  const dispatch = useDispatch();
  const taskCompleted = useSelector(getCompletedTaskList);

  const completedTask = Array.from(
    new Set(taskCompleted?.map((data: any) => data?._id)),
  );
  return (
    <>
      <div className="mytodos" style={{ minWidth: '250px' }}>
        <div className="title-priority">
          {type === 'admin' ? (
            <div>
              <img
                src={profile ? profile : 'sf'}
                style={{
                  maxWidth: '40px',
                  maxHeight: '50px',
                  objectFit: 'contain',
                  borderRadius: '50%',
                }}
              />
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 'normal',
                  color: 'gray',
                }}
              >
                {name}
              </p>
            </div>
          ) : (
            <p>{title}</p>
          )}

          {type !== 'admin' ? priorityColor(priority) : <p>{role}</p>}
        </div>
        {type !== 'admin' ? (
          <div className="description">
            {/**description */}
            <p>
              {description?.slice(0, 200)}
              {description?.length > 200 && <p>...</p>}
            </p>
          </div>
        ) : (
          <p>{email}</p>
        )}

        <div>
          {/*created and updated and proirity*/}
          <div className="create-update">
            <i style={{ color: 'gray', fontSize: '13px', minWidth: '60px' }}>
              Created at:
            </i>
            <p style={{ fontSize: '13px' }}>{createdAt}</p>
          </div>
          <div className="create-update">
            <i style={{ color: 'gray', fontSize: '13px', minWidth: '60px' }}>
              Updated at:
            </i>
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
          <>
            {type !== 'admin' ? (
              <div className="add-complete">
                <button onClick={() => dispatch(storTaskComplete(data?.data))}>
                  Add to completed
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DisplayTodo;
