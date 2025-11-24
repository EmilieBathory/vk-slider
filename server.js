import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

const app = express();
const __dirname = path.resolve();
const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Раздача статики
app.use(express.static(publicDir));

// API маршрут для получения постов из RSS группы VK
app.get("/api/posts", async (req, res) => {
  try {
    const groupId = "39760212"; // твой ID группы
    const rssUrl = `https://vk.com/rss.php?gid=${groupId}`;

    const response = await fetch(rssUrl);
    const xml = await response.text();
    const data = await parseStringPromise(xml);

    const posts = data.rss.channel[0].item.map(item => ({
      title: item.title[0],
      link: item.link[0],
      description: item.description[0],
      pubDate: item.pubDate[0]
    }));

    res.json(posts);
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
