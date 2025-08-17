import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import screensRoutes from './routes/screens';
import venueRoutes from './routes/venue';
import earningsRoutes from './routes/earnings';

// Load env vars
dotenv.config();

const app = express();
app.use(express.json());

// Permissive CORS (allow from anywhere)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/screens', screensRoutes);
app.use('/api/venue', venueRoutes);
app.use('/api/earnings', earningsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
