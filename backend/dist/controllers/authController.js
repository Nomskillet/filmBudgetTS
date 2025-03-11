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
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require('bcrypt'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const db_1 = __importDefault(require('../db'));
const catchAsync_1 = require('../utils/catchAsync');
const JWT_SECRET = process.env.JWT_SECRET;
// Register User
exports.registerUser = (0, catchAsync_1.catchAsync)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    // Check if email already exists
    const emailCheck = yield db_1.default.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      res.status(409).json({ error: 'Email already in use.' });
      return;
    }
    // Hash password before storing it
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Insert user into the database
    const result = yield db_1.default.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`,
      [email, hashedPassword]
    );
    const user = result.rows[0];
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  })
);
// Login User
exports.loginUser = (0, catchAsync_1.catchAsync)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }
    // Get user from database
    const userResult = yield db_1.default.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    // Compare password with hashed password
    const isPasswordValid = yield bcrypt_1.default.compare(
      password,
      user.password_hash
    );
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  })
);
