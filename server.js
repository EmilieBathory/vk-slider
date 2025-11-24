import express from "express";
import path from "path";
import fs from "fs";

const app = express();

// __dirname в ESM
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Папка public
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Раздача статики
app.use(express.static(publicDir));

// API маршрут VK
app.get("/api/posts", async (req, res) => {
  const token = process.env.VK_TOKEN;    // токен пользователя
  const owner = "-39760212";             // минус обязателен

  if (!token) {
    return res.status(500).json({ error: "VK_TOKEN отсутствует" });
  }

  try {
    const url = `https://api.vk.com/method/wall.get?owner_id=${owner}&count=10&access_token=${token}&v=5.199`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    return res.json(data.response.items);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Все остальные маршруты → index.html
app.get("*", (req, res) => {
  res.sendFile(indexPath);
});

// Запуск
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));
