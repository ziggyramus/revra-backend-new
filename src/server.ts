import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import investigationRoutes from "./routes/investigation.routes";
import jobRoutes from "./routes/job.routes";
import paystackRoutes from "./routes/paystack.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === "production" ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    error: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (NODE_ENV !== "production") {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

console.log("Server initializing...");
console.log("Environment:", NODE_ENV);
console.log("PORT:", PORT);
console.log("MONGODB_URI loaded:", Boolean(MONGODB_URI));
console.log("PAYSTACK_SECRET_KEY loaded:", Boolean(process.env.PAYSTACK_SECRET_KEY));

app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: true,
    message: "REVRA backend is running",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: true,
    service: "revra-backend",
    environment: NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "REVRA Backend Live",
  });
});

app.use("/api/investigations", investigationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/paystack", paystackRoutes);
app.use("/api/users", userRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    status: false,
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("GLOBAL SERVER ERROR:", err);

  const message = err instanceof Error ? err.message : "Internal server error";

  return res.status(500).json({
    status: false,
    error: NODE_ENV === "production" ? "Internal server error" : message,
  });
};

app.use(errorHandler);

const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URI.trim(), {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("MongoDB connected successfully");
};

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log("REVRA BACKEND V2 DEPLOY TEST");
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal: string): Promise<void> => {
  console.log(`${signal} received. Closing server...`);

  await mongoose.connection.close();

  console.log("MongoDB connection closed");
  process.exit(0);
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});