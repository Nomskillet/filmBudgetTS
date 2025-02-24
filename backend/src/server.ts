import express, { Application } from "express";
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

const PORT: number = Number(process.env.PORT) || 5001;
app.listen(PORT, (): void => {
  console.log(`Server is on port ${PORT}`);
});
