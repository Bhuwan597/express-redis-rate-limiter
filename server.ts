import app from "./app";
import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

(async () => {
  app.listen(process.env.APP_PORT, () => {
    console.log(`Running on http://localhost:${process.env.APP_PORT}`);
  });

  // subscriber
  // const subscriber = new Redis();
  // subscriber.subscribe("msg", () => {
  //   console.log(`Subscribed to msg channel`);
  // });
  // subscriber.on("message", (channel, message) => {
  //   console.log(`Message recieved: ${message}`);
  // });
})();
