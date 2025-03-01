import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import budgetRoutes from "./routes/budgetRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api", budgetRoutes);

app.get("/", (req, res) => {
  res.send("Film Budget API is running!");
});

//Global Error Handler (No Try-Catch Needed)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT: number = Number(process.env.PORT) || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
