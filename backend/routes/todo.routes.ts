import express from 'express';
import { authentication } from '../middleware/auth';
import { createTodoList, deleteTask, getTodoList, updateTodoList } from '../controller/todoList.controller';

const todoRoutes = express.Router();

//posts
todoRoutes.post(`/todo`, authentication, createTodoList);

//get
todoRoutes.get(`/todo`, authentication, getTodoList);

//update;
todoRoutes.put('/todo/:id', authentication, updateTodoList)

//delete
todoRoutes.delete('/todo/:id', authentication, deleteTask)



export default todoRoutes;