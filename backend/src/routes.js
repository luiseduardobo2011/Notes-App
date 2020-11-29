import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AuthMiddleware from './app/middlewares/auth';
import NoteController from './app/controllers/NoteController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/users', AuthMiddleware, UserController.update);

routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);
routes.post('/notes', NoteController.store);
routes.get('/notes', NoteController.index);

export default routes;
