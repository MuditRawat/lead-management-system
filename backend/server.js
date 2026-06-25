// 1. CRITICAL: This exact import execution bypasses hoisting and loads variables instantly
import 'dotenv/config'; 

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', leadRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Backend running smoothly on port ${PORT}`));
});