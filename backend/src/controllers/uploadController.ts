import { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Tesseract from 'tesseract.js';
import { getOCRResult, saveOCRResult } from '../services/ocrService';
import db from '../db';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const isSafePath = (filePath: string): boolean => {
  const normalized = path.normalize(filePath);
  return !normalized.includes('..') && !path.isAbsolute(filePath);
};

export const upload = multer({ storage: multer.memoryStorage() });

export const handleImageUpload = async (req: Request, res: Response) => {
  if (!req.file || !req.user?.id) {
    return res.status(400).json({ error: 'Missing file or user info' });
  }

  const { originalname, mimetype, buffer } = req.file;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO ocr_images (user_id, filename, mime_type, data)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, originalname, mimetype, buffer]
    );

    const imageId = result.rows[0].id;

    return res.status(200).json({
      message: 'Image uploaded and stored in database successfully',
      imageId,
      filename: originalname, // optionally include for UI preview fallback
    });
  } catch (error) {
    console.error('Error saving image to DB:', error);
    return res.status(500).json({ error: 'Failed to store image in database' });
  }
};

export const extractTextFromImage = async (req: Request, res: Response) => {
  const { filePath } = req.body;

  if (!filePath || !isSafePath(filePath) || !fs.existsSync(filePath)) {
    return res.status(400).json({ error: 'Invalid or unsafe filePath' });
  }

  try {
    const { data } = await Tesseract.recognize(filePath, 'eng');
    res.status(200).json({ ocrText: data.text });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'OCR failed', details: (err as Error).message });
  }
};

export const runOCR = async (req: Request, res: Response) => {
  const { imageId } = req.body;
  const userId = req.user?.id;

  if (!imageId || !userId) {
    return res.status(400).json({ error: 'Missing image ID or user' });
  }

  try {
    const result = await db.query(
      'SELECT filename, data FROM ocr_images WHERE id = $1 AND user_id = $2',
      [imageId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Image not found for this user' });
    }

    const { filename, data } = result.rows[0];

    const cachedText = await getOCRResult(filename, userId);
    if (cachedText) {
      return res.status(200).json({
        message: 'OCR result retrieved from cache',
        ocr_text: cachedText,
      });
    }

    const { data: ocrData } = await Tesseract.recognize(data, 'eng');
    const extractedText = ocrData.text.trim();

    await saveOCRResult(filename, extractedText, userId);

    res.status(200).json({
      message: 'OCR completed and saved',
      ocr_text: extractedText,
    });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to extract text from image' });
  }
};

export const serveImageById = async (req: Request, res: Response) => {
  const { imageId } = req.params;

  const userId = req.user?.id;

  if (!imageId || !userId) {
    return res.status(400).json({ error: 'Missing image ID or user' });
  }

  try {
    const result = await db.query(
      'SELECT data, mime_type FROM ocr_images WHERE id = $1 AND user_id = $2',
      [imageId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Image not found for this user' });
    }

    const { data, mime_type } = result.rows[0];
    res.setHeader('Content-Type', mime_type);
    res.send(data);
  } catch (error) {
    console.error('Error serving image from DB:', error);
    res.status(500).json({ error: 'Failed to retrieve image from database' });
  }
};
