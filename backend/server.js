import express from "express";
import "dotenv/config";
import dns from "node:dns";
import cors from "cors";
import { connectDb } from "./src/config/db.js";
import userRouter from "./src/routes/userRoutes.js";
import habitRouter from "./src/routes/habitRoutes.js";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();
app.use(cors());
app.use(express.json());
connectDb();
const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;
app.use("/api/auth/user/", userRouter);
app.use("/api/auth/user/", habitRouter);
app.listen(PORT, () => {
  console.log(`${APP_NAME} is running at port ${PORT}`);
});
