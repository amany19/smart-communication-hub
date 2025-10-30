import express, {  Router } from 'express';
import authRoutes from './api/auth.route';
import userRoutes from './api/user.route'
const routes = Router();
routes.use('/auth', authRoutes);
routes.use('/', userRoutes);
export default routes
