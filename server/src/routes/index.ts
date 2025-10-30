import express, {  Router } from 'express';
import authRoutes from './api/auth.route';
import userRoutes from './api/user.route'
import messageRoutes from './api/message.route'
const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes); 
routes.use('/messages', messageRoutes);

export default routes
