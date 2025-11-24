import express from "express";
import fetch from "node-fetch"; // Node 18+ встроенный fetch тоже подойдет
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Статика
app.use(express.static(publicDir));

// API для постов публичной группы
app.get("/api/posts", async (req, res) => {
  try {
    const groupId = "39760212"; // замените на ID вашей публичной группы
    const url = `https://api.vk.com/method/wall.get?owner_id=-${groupId}&count=10&v=5.131`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) return res.status(500).json({ error: data.error });

    res.json(data.response.items || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Любые другие маршруты → index.html
app.get("*", (req, res) => {
  if (!fs.existsSync(indexPath)) return res.status(500).send("index.html не найден");
  res.sendFile(indexPath);
});

// Порт
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
