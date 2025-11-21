const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Проверка существования папки и файла
if (!fs.existsSync(publicDir)) console.error("Папка public не найдена:", publicDir);
if (!fs.existsSync(indexPath)) console.error("Файл index.html не найден:", indexPath);

// Раздача статики
app.use(express.static(publicDir));

// API маршрут для постов VK с токеном пользователя
app.get("/api/posts", async (req, res) => {
const token = process.env.VK_TOKEN; // токен пользователя VK
const owner = "-39760212"; // минус перед ID группы для wall.get

if (!token) return res.status(500).json({ error: "VK_TOKEN не задан" });

try {
const url = `https://api.vk.com/method/wall.get?owner_id=${owner}&count=10&access_token=${token}&v=5.199`;
const response = await fetch(url); // используем встроенный fetch Node 22+
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
