import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';

const app = express();

// Middleware - Configured with a dynamic CORS policy to bypass browser blocking rules
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes - Prefixed with /api to match your frontend services!
app.use('/api', leadRoutes);

// Test Root Route to confirm backend is alive
app.get('/', (req, res) => {
  res.send('Lead Management System API is Online and Running!');
});

// NOTE: The problematic SMTP .verify() loop has been removed here 
// to prevent Render's cloud firewall from freezing the boot routine.

// Database connection & Server Boot
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend server successfully booted on port ${PORT}`);
  });
});