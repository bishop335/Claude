import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import skillsRouter from './routes/skills.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Claude Skills - Node.js Web App',
    version: '1.0.0',
    endpoints: {
      skills: '/api/skills',
      skillById: '/api/skills/:id',
      createSkill: 'POST /api/skills',
      updateSkill: 'PUT /api/skills/:id',
      deleteSkill: 'DELETE /api/skills/:id',
      uploadFile: 'POST /api/skills/:id/upload'
    }
  });
});

app.use('/api/skills', skillsRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export function createServer() {
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}
