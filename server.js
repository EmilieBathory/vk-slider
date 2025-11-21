const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Папка с публичными файлами
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Логи для отладки
console.log("NODE VERSION:", process.version);
console.log("VK_TOKEN задан:", !!process.env.VK_TOKEN);

// Проверяем наличие папки public и файла index.html
if (!fs.existsSync(publicDir)) {
console.error("Папка public не найдена:", publicDir);
} else {
console.log("Папка public найдена:", publicDir);
}

if (!fs.existsSync(indexPath)) {
console.error("Файл index.html не найден:", indexPath);
} else {
console.log("Файл index.html найден:", indexPath);
console.log("Содержимое public:", fs.readdirSync(publicDir));
}

// Раздача статических файлов
app.use(express.static(publicDir));

// API маршрут для получения постов VK
app.get("/api/posts", async (req, res) => {
const token = process.env.VK_TOKEN;
const owner = "-39760212";

if (!token) {
console.error("VK_TOKEN не задан!");
return res.status(500).json({ error: "VK_TOKEN не задан" });
}

try {
const url = `https://api.vk.com/method/wall.get?owner_id=${owner}&count=10&access_token=${token}&v=5.199`;
console.log("Запрос VK:", url);

```
const response = await fetch(url);
const data = await response.json();

if (data.error) {
  console.error("Ошибка VK API:", data.error);
  return res.status(500).json({ error: data.error });
}

console.log("Успешный ответ VK:", data.response);
res.json(data.response);
```

} catch (err) {
console.error("Ошибка запроса VK:", err.message);
res.status(500).json({ error: err.message });
}
});

// Любые другие маршруты отдаём index.html
app.get("*", (req, res) => {
if (!fs.existsSync(indexPath)) {
return res.status(500).send("index.html не найден на сервере");
}
res.sendFile(indexPath, err => {
if (err) {
console.error("Ошибка при отдаче index.html:", err);
res.status(500).send("Ошибка сервера");
}
});
});

// Порт
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
