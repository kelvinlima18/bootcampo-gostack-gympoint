import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import StudentController from './app/controller/StudentController';
import PlanController from './app/controller/PlanController';
import RegisterController from './app/controller/RegisterController';
import CheckinController from './app/controller/CheckinController';
import HelpOrderController from './app/controller/HelpOrderController';
import AnswerController from './app/controller/AnswerController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

/* Rota de Login */
routes.post('/sessions', SessionController.store);

/* Rota de checkin e listagaem */
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

routes.get('/students/:id', StudentController.show);

/* Rota de Questionamentos dos students */
routes.post('/students/:student_id/help-orders', HelpOrderController.store);
routes.get('/students/:student_id/help-orders', HelpOrderController.show);

routes.use(authMiddleware);

/* Rota de criação/edição/listagem de students */
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students', StudentController.index);
routes.delete('/students/:id', StudentController.delete);

/* Rota de criação/edição/listagem/remoção de plans */
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.delete('/plans/:id', PlanController.delete);

/* Rota de matricula de students */
routes.post('/registers', RegisterController.store);
routes.put('/registers/:id', RegisterController.update);
routes.get('/registers', RegisterController.index);
routes.get('/registers/:id', RegisterController.show);
routes.delete('/registers/:id', RegisterController.delete);

/* Rota de listagem e resposta dos questionamentos */
routes.get('/help-orders/', HelpOrderController.index);
routes.post('/help-orders/:id/answers', AnswerController.store);

export default routes;
