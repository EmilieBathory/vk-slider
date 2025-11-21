const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(express.static("public"));

app.get("/api/posts", async (req, res) => {
  const token = process.env.VK_TOKEN;
  const owner = "-39760212";

  try {
    const url = `https://api.vk.com/method/wall.get?owner_id=${owner}&count=10&access_token=${token}&v=5.199`;
    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));
