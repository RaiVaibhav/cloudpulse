import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { servicesRouter } from "./routes/services";
import { incidentsRouter } from "./routes/incidents";

export function createApp(): Express {
  const app = express();

  // Middleware
  const allowedOrigins = [
    'http://localhost:5173',
    'https://cloudpulse-frontend-dev.pages.dev',
    'https://cloudpulse-frontend-stage.pages.dev',
    'https://cloudpulse-frontend-prod.pages.dev',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'test') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));
  app.use(express.json());

  // Request logger
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // Mount API Routes
  app.use("/health", healthRouter);
  app.use("/api/services", servicesRouter);
  app.use("/api/incidents", incidentsRouter);

  // Fallback 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Endpoint not found" });
  });

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled server error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  });

  return app;
}
