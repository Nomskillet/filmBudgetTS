import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Tesseract from 'tesseract.js';
import { getOCRResult, saveOCRResult } from '../services/ocrService';

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

export const upload = multer({ storage });

export const handleImageUpload = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  res.status(200).json({
    message: 'Image uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  });
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
  const { filePath } = req.body;

  if (!filePath || !isSafePath(filePath)) {
    return res.status(400).json({ error: 'Invalid or unsafe file path' });
  }

  const imagePath = path.join(__dirname, '..', '..', filePath);

  try {
    const cachedText = await getOCRResult(filePath);
    if (cachedText) {
      return res.status(200).json({
        message: 'OCR result retrieved from cache',
        ocr_text: cachedText,
      });
    }

    const { data } = await Tesseract.recognize(imagePath, 'eng');
    const extractedText = data.text.trim();

    await saveOCRResult(filePath, extractedText);

    res.status(200).json({
      message: 'OCR completed and saved',
      ocr_text: extractedText,
    });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to extract text from image' });
  }
};
