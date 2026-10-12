import express from "express";
import "dotenv/config";
import dns from "node:dns";
import cors from "cors";

import { connectDb } from "./src/config/db.js";
import userRouter from "./src/routes/userRoutes.js";
import habitRouter from "./src/routes/habitRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://habitlyx.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.push(process.env.CLIENT_ORIGIN);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());

const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "Habitly";

app.get("/", (req, res) => {
  res.status(200).send("server is running");
});

app.use("/api/auth/user/", userRouter);
app.use("/api/auth/user/", habitRouter);

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`${APP_NAME} is running at port ${PORT}`);
      console.log(`Server: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
