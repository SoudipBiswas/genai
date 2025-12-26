import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config/index.js';
import apiRoutes from './routes/api.routes.js';

const app: Express = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // Allow larger code submissions
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'AssumptionLens API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      analyze: 'POST /api/analyze',
      health: 'GET /api/health',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: config.nodeEnv === 'development' ? err.message : 'An unexpected error occurred',
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log('\n🚀 AssumptionLens API Server');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS enabled for: ${config.frontendUrl}`);
  console.log(`🤖 Gemini API: ${config.geminiApiKey ? '✓ Configured' : '✗ Missing API Key'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

export default app;
