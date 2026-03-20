import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";

import todoRouter from "./routes/todoRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
app.use(
  cors({
    origin: "https://planigo.onrender.com",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);
export default app;
