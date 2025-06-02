import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sheetRoutes from "./routes/sheets.route";
import sequelize from "./db/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");

    // Example raw query
    const [results, metadata] = await sequelize.query("SELECT NOW()");
    console.log("Current Time:", results);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

app.use(cors());
app.use(express.json());

app.use("/sheets", sheetRoutes);

app.get("/", (_req, res) => {
  res.send("Hello from Backend 👋");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
