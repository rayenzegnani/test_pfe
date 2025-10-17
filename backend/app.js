const express = require('express');
const mongoose = require('mongoose');
const categoryRouter = require('./routes/category');

const app = express();
const port = 3000;

// Middleware pour lire le JSON
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/categories', categoryRouter);

// Connexion à MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/SOA_project');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
}

connectDB();

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
