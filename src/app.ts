import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import initRoutes from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";
import passport from "passport";
import passportConfig from "./config/passport";

const app: Application = express();

// CORS configuration to allow any site
app.use(
  cors({
    origin: "*", // Allow requests from any origin
  })
);

app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(passport.initialize());
passportConfig(passport);

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes initialization
initRoutes(app);

export default app;
