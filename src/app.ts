import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/user.routes";

const app = express();

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

export default app;