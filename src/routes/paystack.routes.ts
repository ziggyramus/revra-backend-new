import { Router, Request, Response, NextFunction } from "express";
import { updateJobPaymentById } from "../services/job.service";

const router = Router();

const PAYSTACK_BASE_URL = "https://api.paystack.co";

router.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Paystack routes working",
  });
});

router.post(
  "/initialize",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, amount, metadata, callback_url } = req.body;

      if (!process.env.PAYSTACK_SECRET_KEY) {
        return res.status(500).json({
          status: false,
          error: "Missing PAYSTACK_SECRET_KEY",
        });
      }

      if (!email || !amount) {
        return res.status(400).json({
          status: false,
          error: "Email and amount are required",
        });
      }

      const amountInKobo = Math.round(Number(amount) * 100);

      if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
        return res.status(400).json({
          status: false,
          error: "Amount must be a valid positive number",
        });
      }

      const paystackResponse = await fetch(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            amount: amountInKobo,
            callback_url:
              callback_url ||
              "https://user-stream-flow.base44.app/payment-success",
            metadata,
          }),
        }
      );

      const paystackData = await paystackResponse.json();

      if (!paystackResponse.ok || !paystackData.status) {
        console.error("PAYSTACK INITIALIZE ERROR:", paystackData);

        return res.status(400).json({
          status: false,
          error: paystackData?.message || "Paystack initialization failed",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Payment initialized",
        data: paystackData.data,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get(
  "/verify/:reference",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reference } = req.params;

      if (!process.env.PAYSTACK_SECRET_KEY) {
        return res.status(500).json({
          status: false,
          error: "Missing PAYSTACK_SECRET_KEY",
        });
      }

      if (!reference) {
        return res.status(400).json({
          status: false,
          error: "Reference is required",
        });
      }

      const response = await fetch(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.status || data?.data?.status !== "success") {
        return res.status(400).json({
          status: false,
          error: data?.message || "Payment verification failed",
        });
      }

      const amount = Number(data.data.amount || 0) / 100;
      const jobId = data?.data?.metadata?.jobId;

      if (!jobId) {
        return res.status(400).json({
          status: false,
          error: "Missing jobId in payment metadata",
        });
      }

      const updatedJob = await updateJobPaymentById(jobId, reference, amount);

      return res.status(200).json({
        status: true,
        message: "Payment verified",
        data: {
          reference,
          amount,
          payment: data.data,
          job: updatedJob,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;