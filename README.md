# 🚀 TaskBoard

A sleek, modern task management board built with React and Framer Motion — featuring dark mode, responsive design, animated badge celebrations, and a dynamic splash cursor.

---

## ✨ Features

* 🔥 Fluid **WebGL splash cursor** animation
* 🌙 **Dark mode** with persistent toggle
* 🧩 **Task management** with creation, editing, and drag-and-drop reordering
* 📱 **Responsive UI** optimized for all screen sizes
* 🎨 Clean and modern design with gradients and subtle transitions
* 🏅 **Animated badge celebration system**
* 🥇 **Robust badge queueing** — handles multiple achievements sequentially
* 🎉 **Confetti & badge integration** — no overlap between effects
* 🎯 **Perfect centering and polish** across devices and modes

---

## 🏅 Badge Celebration System

* Earn achievements (e.g., first task, 10 tasks, night owl, etc.)
* A **circular celebration modal** with icon and badge name pops up in the center
* A **toast notification** (“Achievement Unlocked!”) appears at the top
* Works seamlessly with confetti: celebrations wait their turn
* **Mobile-friendly, perfectly centered**, and dark-mode compatible
* **Multiple badge celebrations** are queued — no visual collision

---

## 📦 Tech Stack

* ⚛️ React
* 🎞️ Framer Motion
* 🌐 Custom WebGL cursor
* 💅 HTML/CSS (Dark mode + responsive)
* ⚡ Vite

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

```bash
npm run build
```

* Output goes to the `dist` folder

---

## ☁️ Deployment

### 🔗 Netlify

* **Base directory:** `task-dashboard`

* **Build command:** `npm run build`

* **Publish directory:** `dist`

* Add this to `public/_redirects`:

  ```
  /*    /index.html   200
  ```

* Ensure `.nvmrc` and `netlify.toml` pin Node.js to `18`

### ▲ Vercel

* **Root directory:** `task-dashboard`
* **Build command:** `npm run build`
* **Output directory:** `dist`
* Add this to `vercel.json`:

  ```json
  {
    "routes": [
      { "src": "/(.*)", "dest": "/index.html" }
    ]
  }
  ```

---

## 🖼️ Assets & Icons

* Place assets like `favicon.ico`, `logo.webp`, etc. inside the `public/` folder
* Reference them in `index.html`:

  ```html
  <link rel="icon" type="image/webp" href="/logo.webp" />
  ```

---

## ⚠️ Notes

* Requires **Node.js v18+** (`.nvmrc` is provided)
* `Rollup` is pinned to v3 for compatibility with Netlify + Vite
* After adding new dependencies, run:

  ```bash
  npm install
  git commit package-lock.json
  ```

---

## 📄 License

**MIT** — free to use, modify, and distribute.

---


