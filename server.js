<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>VK Slider</title>
<style>
  #slider { display: flex; overflow-x: auto; gap: 10px; }
  .card { min-width: 200px; border: 1px solid #ccc; padding: 10px; border-radius: 5px; }
</style>
</head>
<body>
<h1>VK Slider</h1>
<div id="slider"></div>

<script>
async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  const slider = document.getElementById('slider');
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = post.text ? post.text : 'Пустой пост';
    slider.appendChild(div);
  });
}
loadPosts();
</script>
</body>
</html>
