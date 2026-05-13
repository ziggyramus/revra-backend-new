import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/user.routes";
import paystackRoutes from './routes/paystack.routes';
import jobRoutes from './routes/job.routes';

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(
rateLimit({
windowMs: 15 * 60 * 1000,
max: 100,
})
);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use('/paystack', paystackRoutes);
app.use('/jobs', jobRoutes);

export default app;