'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const uploadController_1 = require('../controllers/uploadController');
const router = express_1.default.Router();
// Correct relative to /api/upload
router.post(
  '/',
  uploadController_1.upload.single('image'),
  uploadController_1.handleImageUpload
); // POST /api/upload
router.post('/ocr', (req, res, next) => {
  (0, uploadController_1.runOCR)(req, res).catch(next); // POST /api/upload/ocr
});
exports.default = router;
