import { Request, Response, NextFunction } from "express";
import {
  createInvestigation,
  getInvestigationById,
  listInvestigations,
  updateInvestigation,
  deleteInvestigation,
} from "../services/investigation.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body;

    if (!data.organizationId || !data.title || !data.type) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: organizationId, title, type",
      });
      return;
    }

    const investigation = await createInvestigation(data);

    res.status(201).json({
      success: true,
      message: "Investigation created successfully",
      data: investigation,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const investigation = await getInvestigationById(req.params.id);

    if (!investigation) {
      res.status(404).json({
        success: false,
        error: "Investigation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: investigation,
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { organizationId, status, priority, page = 1, limit = 100 } = req.query;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        error: "organizationId is required",
      });
      return;
    }

    const investigations = await listInvestigations({
      organizationId: organizationId as string,
      status: status as string | undefined,
      priority: priority as string | undefined,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      count: investigations.length,
      data: investigations,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const investigation = await updateInvestigation(req.params.id, req.body);

    if (!investigation) {
      res.status(404).json({
        success: false,
        error: "Investigation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Investigation updated successfully",
      data: investigation,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await deleteInvestigation(req.params.id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: "Investigation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Investigation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};