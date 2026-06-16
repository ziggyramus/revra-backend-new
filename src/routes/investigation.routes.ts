import { Router } from 'express';
import * as InvestigationController from '../controllers/investigation.controller';

const investigationRoutes = Router();

investigationRoutes.post('/', InvestigationController.create);
investigationRoutes.get('/', InvestigationController.list);
investigationRoutes.get('/:id', InvestigationController.getById);
investigationRoutes.put('/:id', InvestigationController.update);
investigationRoutes.delete('/:id', InvestigationController.remove);

export default investigationRoutes;