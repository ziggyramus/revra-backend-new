import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import investigationRoutes from './routes/investigation.routes';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import paystackRoutes from "./routes/paystack.routes";
// import userRoutes from "./routes/user.routes"; // uncomment if you have this file
// import authRoutes from "./routes/auth.routes"; // uncomment if you have this file

dotenv.config();

import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from .env");
}

mongoose
  .connect(mongoUri.trim(), {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


const app: Application = express();
app.set("trust proxy", 1);
const PORT = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");

app.use(helmet());

app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS
app.use(
cors({
origin: true,
credentials: true
})
);

// REQUIRED: parse JSON body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/investigations', investigationRoutes);
app.use(express.json());
// Health check
app.get("/", (_req: Request, res: Response) => {
res.status(200).json({
status: true,
message: "Backend is running",
});
});

app.get("/health", (_req: Request, res: Response) => {
res.status(200).json({
status: true,
service: "revra-backend",
timestamp: new Date().toISOString(),
});
});

// Debug env check
console.log("Server starting...");
console.log("PORT:", PORT);
console.log(
"PAYSTACK_SECRET_KEY loaded:",
Boolean(process.env.PAYSTACK_SECRET_KEY)
);

// Routes
app.use("/api/paystack", paystackRoutes);

// app.use("/users", userRoutes); // uncomment if you have this file
// app.use("/auth", authRoutes); // uncomment if you have this file

// 404 handler
app.use((req: Request, res: Response) => {
res.status(404).json({
status: false,
error: `Route not found: ${req.method} ${req.originalUrl}`,
});
});

// Global error handler
app.use(
(
err: unknown,
_req: Request,
res: Response,
_next: NextFunction
) => {
console.error("GLOBAL SERVER ERROR:", err);

const message =
err instanceof Error ? err.message : "Internal server error";

res.status(500).json({
status: false,
error: message,
});
}
);

app.post('/jobs/create-test', async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'create-test route reached',
      data: req.body
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("REVRA BACKEND V2 DEPLOY TEST");
  console.log(`Server running on port ${PORT}`);
});
