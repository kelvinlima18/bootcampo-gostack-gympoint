import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import StudentController from './app/controller/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.post('/students', authMiddleware, StudentController.store);
routes.put('/students/:id', authMiddleware, StudentController.update);

routes.get('/students/:id', StudentController.show);
routes.get('/students', StudentController.index);

export default routes;
