// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user without username
    const result = await pool.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`,
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Dummy loginUser function to fix the import error temporarily
export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({ message: 'Login endpoint is not yet implemented.' });
};
