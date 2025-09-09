import express from "express";
import { EventEmitter } from "events";

const router = express.Router();
const sseEmitter = new EventEmitter();
const counters: Record<string, any> = {};

router.get("/", (req, res) => {
  res.json(Object.values(counters));
});

router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const onCounter = (payload: any) => {
    res.write(`event: counter\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const onRule = (payload: any) => {
    res.write(`event: rule\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  sseEmitter.on("counter", onCounter);
  sseEmitter.on("rule", onRule);

  req.on("close", () => {
    sseEmitter.removeListener("counter", onCounter);
    sseEmitter.removeListener("rule", onRule);
  });
});

export { sseEmitter, counters };
export default router;
