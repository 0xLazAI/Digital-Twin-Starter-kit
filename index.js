import express from "express";
import cors from "cors";


import dotenv from 'dotenv';
dotenv.config();
import twitterRoutes from './routes/twitterRoutes.js';
import CronService from './services/cronService.js';

const app = express();
const cronService = new CronService();

app.use(cors({
  origin: '*', // Allow all origins
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log('Received request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

app.use('/api', twitterRoutes);

// Add cron status endpoint
app.get('/api/cron/status', (req, res) => {
  const status = cronService.getStatus();
  res.json(status);
});

// Add cron control endpoints (optional - for manual control)
app.post('/api/cron/start', (req, res) => {
  cronService.start();
  res.json({ message: 'Cron service started' });
});

app.post('/api/cron/stop', (req, res) => {
  cronService.stop();
  res.json({ message: 'Cron service stopped' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));




const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  
  // Start the cron service
  cronService.start();
});