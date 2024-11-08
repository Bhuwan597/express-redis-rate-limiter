import { NextFunction, Request, Response } from "express";
import redisClient from "./config";

export interface RateLimiterConfig {
  endpoint: string;
  rateLimit: {
    timeInSeconds: number;
    limit: number;
  };
}

export const FixedRateLimiter = (config: RateLimiterConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestIpAddress = req.ip;
    const redisId = `rateLimiter:${config.endpoint}:${requestIpAddress}`;

    try {
      const requests = await redisClient.incr(redisId);

      if (requests === 1) {
        await redisClient.expire(redisId, config.rateLimit.timeInSeconds);
      }

      if (requests > config.rateLimit.limit) {
        res.status(429).json({
          message: "Too many requests. Please try again later!",
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export const SlidingRateLimiter = (config: RateLimiterConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestIpAddress = req.ip;
      const redisKey = `rateLimiter:${config.endpoint}:${requestIpAddress}`;
      const currentTime = Date.now();
      const windowStartTime =
        currentTime - config.rateLimit.timeInSeconds * 1000;

      // remove outdated requests older than sliding window
      await redisClient.zremrangebyscore(redisKey, 0, windowStartTime);

      // count the requests
      const requestsCount = await redisClient.zcard(redisKey);

      // return error response if requestsCount is greater than limit
      if (requestsCount >= config.rateLimit.limit) {
        res.status(429).json({
          message: "Too many requests. Please try again later!",
        });
        return;
      }

      // add the new request with score of current timestamp
      await redisClient.zadd(redisKey, currentTime, `Request: ${requestsCount + 1}`);

      // also setup expiry
      await redisClient.expire(redisKey, config.rateLimit.timeInSeconds);

      next();
    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "Something went wrong!",
      });
    }
  };
};
