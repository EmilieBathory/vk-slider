import express from "express";
import fetch from "node-fetch";

const app = express();

const TOKEN = process.env.VK_TOKEN;
const GROUP_ID = "-39760212";

app.get("/slider", async (req, res) => {
  try {
    const url = `https://api.vk.com/method/wall.get?owner_id=${GROUP_ID}&count=10&access_token=${TOKEN}&v=5.131`;
    const response = await fetch(url);
    const data = await response.json();
    const posts = data.response.items;

    let slidesHTML = posts.map(post => {
      let imgHTML = "";

      if (post.attachments) {
        const photo = post.attachments.find(a => a.type === "photo");
        if (photo) {
          const sizes = photo.photo.sizes;
          const largest = sizes[sizes.length - 1];
          imgHTML = `<img src="${largest.url}" 
                          style="width:100%;height:200px;object-fit:cover;border-radius:12px 12px 0 0;">`;
        }
      }

      const text = post.text || "";
      const postLink = `https://vk.com/wall${GROUP_ID}_${post.id}`;

      return `
        <div class="slide">
          <a href="${postLink}" target="_blank" style="text-decoration:none;color:inherit;">
            ${imgHTML}
            <div class="text" style="padding:10px;font-size:14px;overflow:hidden;height:100px;">
              ${text}
            </div>
          </a>
        </div>
      `;
    }).join("");

    const html = `
      <html>
      <head>
      <style>
        body { margin:0; font-family:sans-serif; background:#f9f9f9; }
        .slider { display:flex; gap:20px; padding:20px; overflow-x:auto; }
        .slide { flex:0 0 300px; background:#fff; border-radius:12px; 
                 box-shadow:0 10px 25px rgba(0,0,0,0.08); }
        .slide img { display:block; }
      </style>
      </head>
      <body>
        <div class="slider">${slidesHTML}</div>
      </body>
      </html>
    `;

    res.send(html);

  } catch(err) {
    res.status(500).send(`Ошибка: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
