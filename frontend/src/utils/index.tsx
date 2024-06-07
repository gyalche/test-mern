import { InputComponent } from '../UI/InputComponent';

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
