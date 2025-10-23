const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const port = 3000;

const categoryRouter = require('./routes/category');
const brandRouter = require('./routes/brand');
const productRouter = require('./routes/product');
const customerRouter = require('./routes/customer');
const authRouter = require('./routes/auth');
app.use(express.json());
app.use(cookieParser());

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