import mongoose from "mongoose";

interface BucketDoc extends mongoose.Document {
  key: string;
  tokens: number;
  lastRefill: Date;
}

const bucketSchema = new mongoose.Schema<BucketDoc>({
  key: { type: String, required: true, unique: true },
  tokens: { type: Number, required: true },
  lastRefill: { type: Date, required: true }
});

const Bucket = mongoose.model<BucketDoc>("Bucket", bucketSchema);

export async function consumeToken(
  key: string,
  capacity: number,
  refillRate: number
) {
  const now = new Date();

  const bucket = await Bucket.findOneAndUpdate(
    { key },
    { $setOnInsert: { tokens: capacity, lastRefill: now } },
    { new: true, upsert: true }
  );

  const elapsedSeconds =
    (now.getTime() - bucket.lastRefill.getTime()) / 1000;
  const refillTokens = Math.floor(elapsedSeconds * refillRate);
  bucket.tokens = Math.min(capacity, bucket.tokens + refillTokens);
  bucket.lastRefill = now;

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    await bucket.save();
    return { allowed: true, remaining: bucket.tokens, capacity };
  } else {
    await bucket.save();
    return { allowed: false, remaining: bucket.tokens, capacity };
  }
}
