import { Request, Response } from 'express';
import {
createInvestigation,
getInvestigationById,
getInvestigationsByOrgId,
listInvestigations,
updateInvestigation,
deleteInvestigation,
} from '../services/investigation.service';

export const create = (req: Request, res: Response): void => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.organizationId || !data.title || !data.type) {
      res.status(400).json({ error: 'Missing required fields: organizationId, title, type' });
      return;
    }

    const investigation = createInvestigation(data);
    res.status(201).json(investigation);

  } catch (error: any) {
res.status(500).json({
error: error.message || 'Internal server error',
});
  }
};

export const getById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const investigation = getInvestigationById(id as string);

    if (!investigation) {
      res.status(404).json({ error: 'Investigation not found' });
      return;
    }

    res.json(investigation);
  } catch (error: any) {
res.status(500).json({
error: error.message || 'Internal server error',
});
  }
};

export const list = (req: Request, res: Response): void => {
  try {
    const { organizationId, status, priority, page = 1, limit = 100 } = req.query;

    if (!organizationId) {
      res.status(400).json({ error: 'organizationId is required' });
      return;
    }

    const filters = {
      organizationId: organizationId as string,
      ...(status && { status: status as string }),
      ...(priority && { priority: priority as string }),
      page: Number(page),
      limit: Number(limit),
    };

    const investigations = listInvestigations(filters);
    res.json(investigations);
  } catch (error: any) {
res.status(500).json({
error: error.message || 'Internal server error',
});
  }
};

export const update = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const data = req.body;

    const investigation = updateInvestigation(id as string, data);

    if (!investigation) {
      res.status(404).json({ error: 'Investigation not found' });
      return;
    }

    res.json(investigation);
  } catch (error: any) {
res.status(500).json({
error: error.message || 'Internal server error',
});
  }
};

export const remove = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;

    const deleted = deleteInvestigation(id as string);

    if (!deleted) {
      res.status(404).json({ error: 'Investigation not found' });
      return;
    }

    res.json({ success: true, message: 'Investigation deleted' });
  } catch (error: any) {
res.status(500).json({
error: error.message || 'Internal server error',
});
  }
};