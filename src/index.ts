import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

const env = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${env}` });

const PORT = process.env.PORT || 8000;

connectDB();

app.get("/", (req, res) => {
  res.send("Hi There, Welcome to the SPARK!!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
