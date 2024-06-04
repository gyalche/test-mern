import express from 'express';
import { authentication, authorization } from '../middleware/auth';
import { getAllUsers } from '../controller/admin.controller';

const adminRoutes = express.Router();

adminRoutes.get('/users', authentication, authorization('admin'), getAllUsers);

export default adminRoutes;