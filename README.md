# 🚀 TaskBoard

A modern, high-performance task management board built with React and Framer Motion — featuring dark mode, elegant animations, badge-based achievement tracking, and an interactive splash cursor.

---

## ✨ Features

* 🖱️ **Fluid WebGL splash cursor** with reactive motion
* 🌙 **Dark mode** toggle with persistent user preference
* 🧩 **Intuitive task management** — create, edit, and drag-and-drop reorder tasks and projects
* 💻 **Adaptive layout** designed for modern desktops and large screens
* 🎨 **Polished UI/UX** with subtle transitions, gradients, and clean visuals
* 🏅 **Dynamic badge celebration system** with queue handling
* 🎉 **Confetti + badge coordination** — zero animation overlap
* ⏰ **Integrated Pomodoro timer** with audio cues for session transitions

---

## 🏅 Badge Celebration System

Achievement tracking that rewards user milestones with style:

* Unlock badges for key actions (e.g., first task, task streaks, late-night productivity)
* **Centered modal celebration** with badge icon and name
* **"Achievement Unlocked" toast** for additional feedback
* **Confetti animation** timed to avoid overlapping with other effects
* **Fully queued** — celebrations appear one at a time
* **Fully dark-mode compatible**

---

## 📦 Tech Stack

* ⚛️ React
* 🎞️ Framer Motion
* 🌐 Custom WebGL Cursor
* 💅 HTML/CSS (dark mode, flex/grid layout)
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

* Output will be available in the `dist` folder

---

## ☁️ Deployment

### 🔗 Netlify

* **Base directory:** `task-dashboard`
* **Build command:** `npm run build`
* **Publish directory:** `dist`

Add the following to `public/_redirects`:

```
/*    /index.html   200
```

Ensure `.nvmrc` and `netlify.toml` specify Node.js `v18`.

### ▲ Vercel

* **Root directory:** `task-dashboard`
* **Build command:** `npm run build`
* **Output directory:** `dist`

Add the following to `vercel.json`:

```json
{
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

## 🖼️ Assets & Icons

Place assets like `favicon.ico`, `logo.webp`, etc. inside the `public/` folder. Reference them in `index.html`:

```html
<link rel="icon" type="image/webp" href="/logo.webp" />
```

---

## ⚠️ Requirements & Notes

* Requires **Node.js v18+**
* `.nvmrc` is provided to standardize development environments
* `Rollup` is pinned to v3 for compatibility with Vite + Netlify
* After installing new packages:

```bash
npm install
git commit package-lock.json
```

---

## 📄 License

**MIT License** — free to use, modify, and distribute.

---

