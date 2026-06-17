import { Router, Request, Response, NextFunction } from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJobById,
} from "../services/job.service";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await createJob(req.body);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await getJobs();

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await updateJobById(req.params.id, req.body);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;