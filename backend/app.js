
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
const authMiddleware = require('./middleware/auth-middleware');
const { initializeFirebase } = require('./config/firebase');

// Importer les routes
const categoryRouter = require('./routes/category');
const brandRouter = require('./routes/brand');
const productRouter = require('./routes/product');
const customerRouter = require('./routes/customer');
const authRouter = require('./routes/auth');

// Middlewares
require('dotenv').config();
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Route de test
app.get('/', (req, res) => {
  res.send('Server is running with Firebase');
});

// Routes de l'application
app.use('/categories', categoryRouter);
app.use('/brands', brandRouter);
app.use('/products', authMiddleware, productRouter);
app.use('/customers', customerRouter);
app.use('/auth', authRouter);

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Démarrage du serveur
async function startServer() {
  try {
    initializeFirebase();
    
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion de la fermeture gracieuse
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Démarrer le serveur
startServer();

// Exporter pour les tests
module.exports = app;
