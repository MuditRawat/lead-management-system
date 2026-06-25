import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';

const app = express();

// Middleware - Configured to accept requests from Vercel
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://lead-management-system-sepia.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Routes - Prefixed with /api to match your frontend services!
app.use('/api', leadRoutes);

// Test Root Route to confirm backend is alive
app.get('/', (req, res) => {
  res.send('Lead Management System API is Online and Running!');
});

// Outbound SMTP Diagnostic Verifier
const transporterTest = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporterTest.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Setup Failure! Gmail App Password or Username is incorrect:", error.message);
  } else {
    console.log("✅ SMTP Server is authenticated and fully ready to dispatch emails!");
  }
});

// Database connection & Server Boot
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend server successfully booted on port ${PORT}`);
  });
});