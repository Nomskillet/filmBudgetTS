import express from 'express';
import {
  upload,
  handleImageUpload,
  runOCR,
} from '../controllers/uploadController';

const router = express.Router();

// Correct relative to /api/upload
router.post('/', upload.single('image'), handleImageUpload); // POST /api/upload
router.post('/ocr', (req, res, next) => {
  runOCR(req, res).catch(next); // POST /api/upload/ocr
});

export default router;
