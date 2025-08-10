import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import redirectRoutes from './routes/redirectRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Only show root API info when not serving static frontend
if (process.env.SERVE_STATIC !== 'true') {
  app.get('/', (_req, res) => {
    res.json({
      name: 'URL Shortener API',
      endpoints: {
        auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
        links: ['/api/links (GET,POST)', '/api/links/:id (DELETE)'],
        redirect: '/r/:shortCode'
      },
      docs: 'See README.md'
    });
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
// Serve redirects under /r to keep root clean or for SPA
app.use('/r', redirectRoutes);

// Optional static serving of React build
if (process.env.SERVE_STATIC === 'true') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  console.log('[static] Serving React build from', clientDist);
  // SPA fallback (skip for API and redirect namespaces)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/r')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
