import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorMiddleware } from "@/middlewares/error.js";
import morgan from "morgan";
import { connectDB } from "@/lib/db.js";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import authRoutes from "@/routes/auth.js";
import taskRoutes from "@/routes/tasks.js";

dotenv.config({ path: "./.env" });

export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;

connectDB();

const app = express();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(
  helmet({
    contentSecurityPolicy: envMode !== "DEVELOPMENT",
    crossOriginEmbedderPolicy: envMode !== "DEVELOPMENT",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(morgan("dev"));
app.use("/api", apiLimiter);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "ai-task-platform-backend",
    mode: envMode,
  });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/*splat", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);

app.listen(port, () =>
  console.log(
    "Server is working on Port:" + port + " in " + envMode + " Mode.",
  ),
);
