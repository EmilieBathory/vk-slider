import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "public");
const indexPath = path.join(publicDir, "index.html");

// Раздача статики
app.use(express.static(publicDir));

// API маршрут для постов VK (публичная группа)
app.get("/api/posts", async (req, res) => {
  try {
    const groupUrl = "https://vk.com/public39760212"; // замени на свою группу
    const response = await fetch(groupUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const posts = [];
    $(".wall_text").each((i, elem) => {
      const text = $(elem).text().trim();
      posts.push({ text });
    });

    res.json(posts.slice(0, 10)); // возвращаем 10 постов
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Любые другие маршруты → index.html
app.get("*", (req, res) => {
  res.sendFile(indexPath);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
