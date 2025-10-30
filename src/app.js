import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stockRoutes from "./routes/stockRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", stockRoutes);

export default app;