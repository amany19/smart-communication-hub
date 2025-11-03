import express, {  Router } from 'express';
import authRoutes from './api/auth.route';
import userRoutes from './api/user.route'
import messageRoutes from './api/message.route'
import insightsRoutes from './api/insights.route'
const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes); 
routes.use('/messages', messageRoutes);
routes.use('/insights', insightsRoutes);

export default routes
