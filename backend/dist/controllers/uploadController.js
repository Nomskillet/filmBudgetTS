'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.runOCR =
  exports.extractTextFromImage =
  exports.handleImageUpload =
  exports.upload =
    void 0;
const multer_1 = __importDefault(require('multer'));
const path_1 = __importDefault(require('path'));
const fs_1 = __importDefault(require('fs'));
const tesseract_js_1 = __importDefault(require('tesseract.js'));
const storage = multer_1.default.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
exports.upload = (0, multer_1.default)({ storage });
const handleImageUpload = (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  res.status(200).json({
    message: 'Image uploaded successfully',
    filePath: req.file.path,
  });
};
exports.handleImageUpload = handleImageUpload;
const extractTextFromImage = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { filePath } = req.body;
    if (!filePath || !fs_1.default.existsSync(filePath)) {
      return res.status(400).json({ error: 'Valid filePath is required' });
    }
    try {
      const { data } = yield tesseract_js_1.default.recognize(filePath, 'eng');
      res.status(200).json({ ocrText: data.text });
    } catch (err) {
      res.status(500).json({ error: 'OCR failed', details: err.message });
    }
  });
exports.extractTextFromImage = extractTextFromImage;
const runOCR = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const imagePath = path_1.default.join(
      __dirname,
      '..',
      '..',
      req.body.filePath
    );
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }
    try {
      const { data } = yield tesseract_js_1.default.recognize(imagePath, 'eng');
      const extractedText = data.text.trim();
      res.status(200).json({
        message: 'OCR completed successfully',
        ocr_text: extractedText,
      });
    } catch (error) {
      console.error('OCR error:', error);
      res.status(500).json({ error: 'Failed to extract text from image' });
    }
  });
exports.runOCR = runOCR;
