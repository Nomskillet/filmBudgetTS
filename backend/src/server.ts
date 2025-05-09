import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import budgetRoutes from './routes/budgetRoutes';
import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import uploadRoutes from './routes/uploadRoutes';
import path from 'path';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api', budgetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', expenseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.send('Film Budget API is running!');
});

//Global Error Handler (No Try-Catch Needed)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT: number = Number(process.env.PORT) || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
