import express from "express";
import rateLimiter from "../rateLimiter.js";
import { counters, sseEmitter } from "./counters.js";

const router = express.Router();

router.get("/", rateLimiter, (req, res) => {
  const key = (req.headers["x-api-key"] as string) || "guest";
  counters[key] = counters[key] || { key, capacity: 10, remaining: 10 };
  counters[key].remaining = Math.max(0, counters[key].remaining - 1);

  sseEmitter.emit("counter", counters[key]);
  res.json({ message: "Request successful", key });
});

export default router;
