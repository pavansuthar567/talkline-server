import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";
import { connectRedis } from "./config/redis";
import { connectKafka } from "./services/kafka/index";

const env = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${env}` });

(async () => {
  await connectDB();
  await connectRedis();
  connectKafka().catch(console.error);

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  });
})();

app.get("/", (req, res) => {
  res.send("Hi There, Welcome to the SPARK!!");
});
