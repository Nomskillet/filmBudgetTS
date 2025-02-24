import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("db.ts is running...");

const pool: Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
