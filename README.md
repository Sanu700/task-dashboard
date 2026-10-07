# ✅ Task Dashboard

> **A modern, productivity-focused task manager built with React 19, Vite, and Tailwind CSS.** Track tasks, organize projects with Kanban boards, execute deep work sessions with Focus Mode, and stay productive.

![Task Dashboard](https://img.shields.io/badge/Task_Dashboard-v1.0.0-27ae60?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.3-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38b2ac?style=flat-square&logo=tailwindcss)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00c7b7?style=flat-square&logo=netlify)

---

## 🌐 Live Demo

🚀 **[task-dash.netlify.app](https://task-dash.netlify.app)**

---

## ✨ Key Features

- 📅 **Today & Upcoming Views** — Organize daily tasks and stay ahead of deadlines.
- 📊 **Kanban Board & Projects** — Drag-and-drop workflow tracking across project columns.
- ⏱️ **Focus Mode (Pomodoro)** — Dedicated focus timer with configurable work/break cycles.
- ⚡ **Command Palette** — Access shortcuts and quick search anywhere using `Ctrl + K` / `Cmd + K`.
- 📝 **Templates** — Quick-start common workflows and task lists.
- 📈 **Insights & Analytics** — Track completion rates, streaks, and productivity trends.
- 🎨 **Modern Dark UI** — Smooth animations powered by Framer Motion & Tailwind CSS v4.
- 💾 **Persistent State** — Data auto-saves to `localStorage` so your tasks persist across reloads.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** / **pnpm**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sanu700/task-dashboard.git
   cd task-dashboard/task-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Project Structure

```
task-dashboard/
└── task-dashboard/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── CommandPalette.jsx  # Global Command Palette (Cmd+K)
    │   │   ├── FocusModal.jsx      # Pomodoro timer & focus session modal
    │   │   ├── KanbanBoard.jsx     # Drag-and-drop board view
    │   │   ├── Layout.jsx          # Main layout with navigation sidebar
    │   │   ├── Sidebar.jsx         # Sidebar navigation & category links
    │   │   └── TaskModal.jsx       # Task creation & editing modal
    │   ├── context/
    │   │   └── TaskContext.jsx     # Global state management & storage
    │   ├── pages/
    │   │   ├── Today.jsx          # Today's task list view
    │   │   ├── Upcoming.jsx       # Scheduled future tasks
    │   │   ├── Projects.jsx       # Project Kanban & list views
    │   │   ├── Templates.jsx      # Prebuilt task templates
    │   │   ├── Insights.jsx       # Productivity stats & charts
    │   │   └── Settings.jsx       # Preferences & theme options
    │   ├── utils/
    │   ├── App.jsx                # Router configuration
    │   ├── index.css              # Global styles & Tailwind CSS imports
    │   └── main.jsx               # Application entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router 7](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://framer.com/motion) |
| **State & Storage** | React Context API & `localStorage` |
| **Deployment** | [Netlify](https://www.netlify.com/) |

---

## 📜 Available Scripts

Inside the `task-dashboard/task-dashboard` directory, you can run:

- `npm run dev` — Runs the app in development mode on port 5173.
- `npm run build` — Builds the app for production to the `dist` folder.
- `npm run preview` — Locally preview the production build.
- `npm run lint` — Runs ESLint to check for code formatting and code quality issues.

---

## 📄 License

MIT — feel free to use and build on this project.
