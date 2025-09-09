import mongoose from "mongoose";

const rateLimitRuleSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  capacity: { type: Number, required: true },
  refillRate: { type: Number, required: true }
});

export default mongoose.model("RateLimitRule", rateLimitRuleSchema);
