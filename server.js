const express = require("express");
const path = require("path");

const app = express();

// Раздача статических файлов из public
app.use(express.static(path.join(__dirname, "public")));

// API маршрут для получения постов VK с расширенной отладкой
app.get("/api/posts", async (req, res) => {
const token = process.env.VK_TOKEN;
const owner = "-39760212";

if (!token) {
console.error("VK_TOKEN не задан");
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
res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
