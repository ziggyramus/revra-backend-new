import { Router, Request, Response } from "express";

const router = Router();

const jobs: any[] = [];

router.post("/", async (req: Request, res: Response) => {
  const job = {
    id: crypto.randomUUID(),
    ...req.body,
    status: req.body.status || "pending",
    paymentStatus: req.body.paymentStatus || "pending",
    createdAt: new Date().toISOString(),
  };

  jobs.push(job);

  return res.status(201).json({
    success: true,
    data: job,
  });
});

router.get("/", async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: jobs,
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const job = jobs.find((j) => j.id === req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: "Job not found",
    });
  }

  return res.json({
    success: true,
    data: job,
  });
});

router.patch("/:id", async (req: Request, res: Response) => {
  const job = jobs.find((j) => j.id === req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: "Job not found",
    });
  }

  Object.assign(job, req.body, {
    updatedAt: new Date().toISOString(),
  });

  return res.json({
    success: true,
    data: job,
  });
});

export default router;