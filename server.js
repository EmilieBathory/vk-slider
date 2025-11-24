import express from "express";
import path from "path";
import fs from "fs";
import Parser from "rss-parser";

const __dirname = path.resolve();
const app = express();
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Проверка папки и файла
if (!fs.existsSync(publicDir)) console.error("Папка public не найдена:", publicDir);
if (!fs.existsSync(indexPath)) console.error("Файл index.html не найден:", indexPath);

app.use(express.static(publicDir));

const parser = new Parser();

// API маршрут для постов VK через RSS
app.get("/api/posts", async (req, res) => {
try {
const groupId = "39760212"; // ваш ID группы
const rssUrl = `https://vk.com/feeds/${groupId}?section=posts`; // ссылка на RSS
const feed = await parser.parseURL(rssUrl);

```
const posts = feed.items.map(item => ({
  title: item.title,
  text: item.contentSnippet || item.content || '',
  link: item.link,
}));

res.json(posts);
```

} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
});

// Любые другие маршруты → index.html
app.get("*", (req, res) => {
if (!fs.existsSync(indexPath)) return res.status(500).send("index
