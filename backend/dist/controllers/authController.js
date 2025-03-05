"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register User
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Insert user without username
        const result = yield db_1.default.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`, [email, hashedPassword]);
        const user = result.rows[0];
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).json({ token, user: { id: user.id, email: user.email } });
    }
    catch (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});
exports.registerUser = registerUser;
// Dummy loginUser function to fix the import error temporarily
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ message: 'Login endpoint is not yet implemented.' });
});
exports.loginUser = loginUser;
