import express, { Request, Response, Router, RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import {
  upload,
  handleImageUpload,
  runOCR,
} from '../controllers/uploadController';
import { isSafePath } from '../utils/isSafePath';

const router: Router = express.Router();

router.post('/', upload.single('image'), handleImageUpload);

router.post('/ocr', (req: Request, res: Response, next) => {
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

export default router;
