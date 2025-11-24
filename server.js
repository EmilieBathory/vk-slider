import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
const __dirname = path.resolve();
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Проверка наличия папки и index.html
if (!fs.existsSync(publicDir)) console.error("Папка public не найдена:", publicDir);
if (!fs.existsSync(indexPath)) console.error("Файл index.html не найден:", indexPath);

// Раздача статики
app.use(express.static(publicDir));

// API маршрут для постов VK (публичная группа)
app.get("/api/posts", async (req, res) => {
  try {
    const groupId = "39760212"; // ID группы без минуса
    const url = `https://api.vk.com/method/widgets.getPosts?owner_id=-${groupId}&count=10&v=5.199`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) return res.status(500).json({ error: data.error });

    // Возвращаем массив постов
    res.json(data.response.posts || []);
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
