import React, { useCallback, useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material';
import SelectComponent from '../../UI/Select';
import { selectPriority } from '../../constants';
import Datepicker from '../../UI/Datepicker';
import { AddTodo } from './addTodo';
import { getTodoLists } from '../../apis/todos';
import { useQuery } from 'react-query';
import {useDebounce} from '../../hooks/debounce';
import DisplayTodo from './DisplayTodo';

const Dashboard = () => {
    const [priority, setPriority]=useState('');
    const [date, setDate] = useState<string>('');
    const [open, setOpen]=useState(false);
    const [search, setSearch]=useState('');
    const debouncedValue = useDebounce(search, 500);

     const todoListMemoize = useCallback(getTodoLists, []);

       const {
         data: todoData,
         isSuccess: getTodoSuccess,
         refetch,
       } = useQuery(
         ['todoLists', priority, date, debouncedValue],
         todoListMemoize,
       );
       useEffect(()=>{
        refetch()
       },[open])
  return (
    <>
      {open && <AddTodo open={open} close={() => setOpen(false)} />}
      <div className="main-todo">
        <div className="todo-add">
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Task
          </Button>
        </div>
        <div className="search-filter">
          <TextField
            style={{ width: '200px' }}
            size="small"
            label="search task by title"
            onChange={(e) => setSearch(e.target.value)}
          />
          <SelectComponent
            value={priority}
            setValue={setPriority}
            data={selectPriority}
            label="Priority"
          />
          <Datepicker value={date} setValue={setDate} />
        </div>
        <div className="todo-list-data">
          {todoData?.data?.map((data: any) => <DisplayTodo data={data} />)}
        </div>
      </div>
    </>
  );
}

export default Dashboard;