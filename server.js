import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch"; // Node 22+ встроенный fetch можно не ставить
const app = express();
const __dirname = path.resolve();

// Папка с фронтендом
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Проверка существования файлов
if (!fs.existsSync(publicDir)) console.error("Папка public не найдена:", publicDir);
if (!fs.existsSync(indexPath)) console.error("Файл index.html не найден:", indexPath);

// Раздача статических файлов
app.use(express.static(publicDir));

// API для последних 10 постов с группы
app.get("/api/posts", async (req, res) => {
  const token = process.env.VK_TOKEN;
  const owner = "-39760212"; // минус перед ID группы для wall.get

  if (!token) return res.status(500).json({ error: "VK_TOKEN не задан" });

  try {
    const url = `https://api.vk.com/method/wall.get?owner_id=${owner}&count=10&access_token=${token}&v=5.199`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) return res.status(500).json({ error: data.error });
    res.json(data.response.items); // возвращаем массив постов
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Любые другие маршруты → index.html
app.get("*", (req, res) => {
  if (!fs.existsSync(indexPath)) return res.status(500).send("index.html не найден на сервере");
  res.sendFile(indexPath);
});

// Порт
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
