import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Tesseract from 'tesseract.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

export const handleImageUpload = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  res.status(200).json({
    message: 'Image uploaded successfully',
    filePath: req.file.path,
  });
};

export const extractTextFromImage = async (req: Request, res: Response) => {
  const { filePath } = req.body;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(400).json({ error: 'Valid filePath is required' });
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
  const imagePath = path.join(__dirname, '..', '..', req.body.filePath);

  if (!imagePath) {
    return res.status(400).json({ error: 'Image path is required' });
  }

  try {
    const { data } = await Tesseract.recognize(imagePath, 'eng');
    const extractedText = data.text.trim();

    res.status(200).json({
      message: 'OCR completed successfully',
      ocr_text: extractedText,
    });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to extract text from image' });
  }
};
