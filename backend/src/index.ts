import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import countersRouter from "./routes/counters.js";
import "./mongoBucket.js"; 
import rulesRouter from "./routes/rules.js";
import demoRouter from "./routes/demo.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/rateLimiterDemo")
  .then(() => console.log("✅ Mongo connected"))
  .catch((err: unknown) => console.error("❌ Mongo error", err));

app.use("/api/counters", countersRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/demo", demoRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
