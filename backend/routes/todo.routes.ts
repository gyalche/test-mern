import express from 'express';
import { authentication } from '../middleware/auth';
import { createTodoList, deleteTask, getTodoList, updateTodoList } from '../controller/todoList.controller';

const todoRoutes = express.Router();

//posts
todoRoutes.post(`/create-todo`, authentication, createTodoList);

//get
todoRoutes.get(`/get-todo`, authentication, getTodoList);

//update;
todoRoutes.put('/update-todo/:id', authentication, updateTodoList)

//delete
todoRoutes.delete('/delete-todo/:id', authentication, deleteTask)



export default todoRoutes;