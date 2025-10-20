const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const categoryRouter = require('./routes/category');
const brandRouter = require('./routes/brand');
const productRouter = require('./routes/product');
const customerRouter = require('./routes/customer');
const authRouter = require('./routes/auth');
app.use(express.json());

// Simple CORS middleware to allow requests from the Angular dev server
app.use((req, res, next) => {
  // allow your frontend origin (change to '*' only for debugging)
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.get('/', (req, res) => {
  res.send('server is running');
});

app.use('/categories', categoryRouter);
app.use('/brands', brandRouter);
app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/auth', authRouter);
async function connectDB() {
  await mongoose.connect('mongodb://localhost:27017', {
    dbName: 'SOA_project',
  });
  console.log('connected to DB');
}

connectDB().catch((err) => {
  console.error(err);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});