const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch"); // Render использует Node 16/18 — здесь работает

const app = express();
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Проверка существования папки и файла
if (!fs.existsSync(publicDir)) console.error("Папка public отсутствует:", publicDir);
if (!fs.existsSync(indexPath)) console.error("index.html отсутствует:", indexPath);

// Раздача статики
app.use(express.static(publicDir));

// API — посты публичной группы без токена
app.get("/api/posts", async (req, res) => {
  try {
    const groupId = "39760212"; // ID группы (без минуса!)
    const url = `https://api.vk.com/method/widgets.getPosts?owner_id=-${groupId}&count=10&v=5.199`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("VK API ERROR:", data.error);
      return res.status(500).json({ error: data.error });
    }

    res.json(data.response.posts || []);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Любые другие маршруты → index.html
app.get("*", (req, res) => {
  res.sendFile(indexPath);
});

// Порт
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on ${port}`));
