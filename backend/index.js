import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbconnection from "./dbconnection.js";

// Routes
import authRoutes from "./Routes/authRoutes.js";
import projectRoutes from "./Routes/projectRoutes.js";
import memberRoutes from "./Routes/memberRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";

const app = express();
// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://taskapp-ceab.vercel.app",
  "https://taskapp-mauve-ten.vercel.app",
  "https://forverceltesting.vercel.app",
  "https://forverceltesting-ih9f.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === "null" || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Database Connection
dbconnection();

// Test Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running successfully 🚀",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test API is working!",
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/members", memberRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);
app.use("/api", chatRoutes); 

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});