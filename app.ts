import express from "express";
import { FixedRateLimiter, SlidingRateLimiter } from "./rate-limiter";
import redisClient from "./config";

const app = express();

app.use(
  SlidingRateLimiter({
    endpoint: "root",
    rateLimit: { limit: 5, timeInSeconds: 30 },
  })
);
// app.use(
//   FixedRateLimiter({ endpoint: "root", rateLimit: { limit: 10, timeInSeconds: 60 } })
// );

app.get("/", (req, res) => {
  // publisher
  // redisClient.publish(
  //   "msg",
  //   JSON.stringify({
  //     msg: "Hello how are you?",
  //     time: new Date(),
  //   })
  // );
  res.status(200).json({
    message: "Hello world!",
  });
});

export default app;
