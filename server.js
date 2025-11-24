import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import Parser from "rss-parser";

const __dirname = path.resolve();
const app = express();
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");
const rssParser = new Parser();

// Проверка папки и файла
if (!fs.existsSync(publicDir)) console.error("Папка public не найдена:", publicDir);
if (!fs.existsSync(indexPath)) console.error("Файл index.html не найден:", indexPath);

app.use(express.static(publicDir));

// RSS URL твоей группы
const rssUrl = "ТУТ_ВСТАВЬ_RSS_СВОЕЙ_ГРУППЫ";

app.get("/api/posts", async (req, res) => {
try {
const feed = await rssParser.parseURL(rssUrl);
const items = feed.items.slice(0, 10).map(item => ({
title: item.title,
link: item.link,
pubDate: item.pubDate,
content: item.contentSnippet
}));
res.json(items);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Любые другие маршруты → index.html
app.get("*", (req, res) => {
res.sendFile(indexPath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
