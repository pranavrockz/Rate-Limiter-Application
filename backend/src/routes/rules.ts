import express from "express";
import RateLimitRule from "../models/RateLimitRule.js";
import { sseEmitter } from "./counters.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const rules = await RateLimitRule.find();
  res.json(rules);
});

router.post("/", async (req, res) => {
  const rule = new RateLimitRule(req.body);
  await rule.save();
  sseEmitter.emit("rule", rule);
  res.json(rule);
});

router.put("/:id", async (req, res) => {
  const updated = await RateLimitRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updated) sseEmitter.emit("rule", updated);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await RateLimitRule.findByIdAndDelete(req.params.id);
  sseEmitter.emit("rule", { deleted: req.params.id });
  res.json({ success: true });
});

export default router;
