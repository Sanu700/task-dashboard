# 🚀 TaskBoard

A sleek, modern task management board built with React and Framer Motion, featuring dark mode and an animated splash cursor.

---

## ✨ Features

- 🔥 Splash cursor fluid animation
- 🌙 Dark mode toggle
- 🧩 Task creation, editing & drag-n-drop organization
- 📱 Responsive design
- 🎨 Modern UI with gradients and transitions

## 📦 Tech Stack

- React
- Framer Motion
- Custom WebGL Splash Cursor
- HTML/CSS (Responsive + Dark mode support)
- Vite

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/taskboard-app.git
cd task-dashboard
npm install
npm run dev
```

---

## 🏗️ Production Build

To build the app for production:

```bash
npm run build
```
The output will be in the `dist` folder.

---

## ☁️ Deployment

### Netlify
- **Base directory:** `task-dashboard`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- Make sure to add a `_redirects` file in `public` with:
  ```
  /*    /index.html   200
  ```
- Node version is pinned to 18 via `.nvmrc` and `netlify.toml`.
- Rollup is pinned to v3 in `package.json` for compatibility.

### Vercel
- **Root directory:** `task-dashboard`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- Make sure `vercel.json` contains:
  ```json
  {
    "routes": [
      { "src": "/(.*)", "dest": "/index.html" }
    ]
  }
  ```

---

## 🖼️ Favicon & Assets
- Place your favicon (e.g., `favicon.ico`, `logo.webp`) in the `public` folder.
- Reference it in `index.html`:
  ```html
  <link rel="icon" type="image/webp" href="/logo.webp" />
  ```

---

## ⚠️ Notes
- Node.js version 18 is required for builds (see `.nvmrc` and `netlify.toml`).
- Rollup is pinned to v3 for compatibility with Vite and Netlify.
- If you add new dependencies, always run `npm install` and commit the updated `package-lock.json`.

---

## 📄 License
MIT
