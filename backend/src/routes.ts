import { Router, Response, Request } from 'express';

import LeassonsController from './controllers/LeassonsController';
import ConnectionsController from './controllers/ConnectionsController';

const leassonsController = new LeassonsController();

const conntectionsController = new ConnectionsController();

const routes = Router();

routes.get('/classes', leassonsController.index);
routes.post('/classes', leassonsController.create);

routes.get('/connections', conntectionsController.index);
routes.post('/connections', conntectionsController.create);

export default routes;
