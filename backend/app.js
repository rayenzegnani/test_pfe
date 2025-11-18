require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authMiddleware = require('./middleware/auth-middleware');
const { initializeFirebase } = require('./config/firebase');

const categoryRouter = require('./routes/category');
const brandRouter = require('./routes/brand');
const productRouter = require('./routes/product');
const customerRouter = require('./routes/customer');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

initializeFirebase();

app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean) || 'http://localhost:4200',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is running with Firebase');
});

app.use('/categories', authMiddleware, categoryRouter);
app.use('/brands', authMiddleware, brandRouter);
app.use('/products', authMiddleware, productRouter);
app.use('/customers', customerRouter);
app.use('/auth', authRouter);
app.use('/users', authMiddleware, userRouter);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;