import express from 'express';

const app = express();

//router imports
import healthcheckRouter from './routes/healthcheck.routes.js';

app.use("/api/v1/healthcheck", healthcheckRouter);
export default app;

