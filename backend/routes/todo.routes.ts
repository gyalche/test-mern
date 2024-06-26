import express from 'express';
import { authentication } from '../middleware/auth';
import { createTodoList, deleteTask, getTodoList, updateTodoList } from '../controller/todoList.controller';
import { dataValidation } from '../middleware/validationMiddleware';
import { todoCreateSchema } from '../utils/schemas/todoSchema';

const todoRoutes = express.Router();

const todoValidation = dataValidation(todoCreateSchema);

//posts
todoRoutes.post(`/todo`, authentication, todoValidation, createTodoList);

//get
todoRoutes.get(`/todo`, authentication, getTodoList);

//update;
todoRoutes.put('/todo/:id', authentication, updateTodoList)

//delete
todoRoutes.delete('/todo/:id', authentication, deleteTask)



export default todoRoutes;