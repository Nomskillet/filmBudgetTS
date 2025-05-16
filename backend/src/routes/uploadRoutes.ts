import express, { Request, Response, Router, RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import {
  upload,
  handleImageUpload,
  runOCR,
  serveImageById,
} from '../controllers/uploadController';
import { isSafePath } from '../utils/isSafePath';
import authMiddleware from '../middlewares/authMiddleware';
import catchAsync from '../utils/catchAsync';
import db from '../db';

const router: Router = express.Router();

router.post('/', authMiddleware, upload.single('image'), (req, res, next) => {
  handleImageUpload(req, res).catch(next);
});

router.post('/ocr', authMiddleware, (req: Request, res: Response, next) => {
  runOCR(req, res).catch(next);
});

interface ImageParams {
  filename: string;
}

const getImageHandler: RequestHandler<ImageParams, any, any, any> = (
  req,
  res
): void => {
  const filename = req.params.filename;

  if (!isSafePath(filename)) {
    res.status(400).json({ error: 'Unsafe filename' });
    return;
  }

  const imagePath = path.join(__dirname, '..', '..', 'uploads', filename);

  if (!fs.existsSync(imagePath)) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  res.sendFile(imagePath);
};

router.get('/image/:filename', getImageHandler);

router.get('/image/id/:imageId', authMiddleware, catchAsync(serveImageById));

export default router;
