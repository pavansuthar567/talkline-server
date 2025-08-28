import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";
import passportConfig from "./config/passport";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiRateLimiter } from "./middleware/rateLimiter";
import initRoutes from "./routes";
import MonitoringService from "./services/monitoring";

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

// Global rate limiting
app.use(apiRateLimiter);

// Request monitoring middleware
app.use(async (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    MonitoringService.trackRequest(
      req.path,
      req.method,
      duration,
      res.statusCode
    );
  });
  next();
});

app.use(passport.initialize());
passportConfig(passport);

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes initialization
initRoutes(app);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
