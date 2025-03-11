'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const cors_1 = __importDefault(require('cors'));
const budgetRoutes_1 = __importDefault(require('./routes/budgetRoutes'));
const authRoutes_1 = __importDefault(require('./routes/authRoutes'));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', budgetRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.get('/', (req, res) => {
  res.send('Film Budget API is running!');
});
//Global Error Handler (No Try-Catch Needed)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});
const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
