import express from 'express';
import { authentication } from '../middleware/auth';
import { createTodoList, getTodoList } from '../controller/todoList.controller';

const todoRoutes = express.Router();

//posts
todoRoutes.post(`/create-todo`, authentication, createTodoList);
todoRoutes.get(`/get-todo`, authentication, getTodoList);



export default todoRoutes;