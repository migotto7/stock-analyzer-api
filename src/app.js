import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stockRoutes from "./routes/stockRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", stockRoutes);
app.use("/api/auth", authRoutes);

export default app;