import express from 'express';
import { authentication } from '../middleware/auth';
import { createTodoList } from '../controller/todoList.controller';

const todoRoutes = express.Router();

//posts
todoRoutes.post(`/create-todo`, authentication, createTodoList);



export default todoRoutes;