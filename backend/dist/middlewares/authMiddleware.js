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
  const authHeader = req.headers.authorization;
  const token = (
    authHeader === null || authHeader === void 0
      ? void 0
      : authHeader.startsWith('Bearer ')
  )
    ? authHeader.split(' ')[1]
    : null;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }
  const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
  if (!decoded || !decoded.id) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }
  req.user = {
    id: decoded.id,
    email: (_a = decoded.email) !== null && _a !== void 0 ? _a : '',
  };
  next();
};
exports.default = authMiddleware;
