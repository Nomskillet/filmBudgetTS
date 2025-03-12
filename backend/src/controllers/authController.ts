import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import catchAsync from '../utils/catchAsync';

const JWT_SECRET = process.env.JWT_SECRET!;

// Register User
export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  // Check if email already exists
  const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [
    email,
  ]);
  if (emailCheck.rows.length > 0) {
    res.status(409).json({ error: 'Email already in use.' });
    return;
  }

  // Hash password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into the database
  const result = await pool.query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`,
    [email, hashedPassword]
  );

  const user = result.rows[0];

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(201).json({ token, user: { id: user.id, email: user.email } });
});

// Login User
export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  // Get user from database
  const userResult = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );

  const user = userResult.rows[0];

  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  // Compare password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid credentials.' });
    return;
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token, user: { id: user.id, email: user.email } });
});
