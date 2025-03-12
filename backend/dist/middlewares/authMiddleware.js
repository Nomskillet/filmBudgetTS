'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
  var _a;
  const token =
    (_a = req.headers.authorization) === null || _a === void 0
      ? void 0
      : _a.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }
  const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
  if (!decoded) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }
  req.user = decoded; // ✅ Now matches the updated interface
  next();
};
exports.default = authMiddleware;
