import { Request, Response, NextFunction } from "express";
import { consumeToken } from "./mongoBucket.js";

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = (req.headers["x-api-key"] as string) || "guest";
  const capacity = 10;
  const refillRate = 1; // tokens/sec

  const { allowed, remaining, capacity: cap } = await consumeToken(
    key,
    capacity,
    refillRate
  );

  if (!allowed) {
    return res.status(429).json({ error: "Too many requests", remaining, capacity: cap });
  }

  next();
}



