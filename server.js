import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch"; // Node 22+ поддерживает встроенный fetch, можно не ставить node-fetch

const app = express();
const __dirname = path.resolve();

// Папка с публичными файлами
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Проверка существования папки и файла
if (!fs.existsSync(publicDir)) console.error("Папка public не найдена:", publicDir);
if (!fs.existsSync(indexPath)) console.error("Файл index.html не найден:", indexPath);

// Раздача статики
app.use(express.static(publicDir));

// API маршрут для постов VK с токеном пользователя
app.get("/api/posts", async (req, res) => {
const VK_USER_TOKEN = process.env.VK_USER_TOKEN; // токен пользователя VK с правами wall
const GROUP_ID = "-39760212"; // ID группы со знаком минус

if (!VK_USER_TOKEN) return res.status(500).json({ error: "VK_USER_TOKEN не задан" });

try {
const url = `https://api.vk.com/method/wall.get?owner_id=${GROUP_ID}&count=10&access_token=${VK_USER_TOKEN}&v=5.199`;
const response = await fetch(url);
const data = await response.json();

```
if (data.error) return res.status(500).json({ error: data.error });

res.json(data.response.items || []);
```

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
