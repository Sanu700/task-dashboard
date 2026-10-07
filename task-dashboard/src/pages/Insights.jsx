import React from 'react';
import { useTaskContext } from '../context/useTaskContext';

export default function Insights() {
  const { state } = useTaskContext();
  const tasks = state.tasks || [];
  const projects = state.projects || [];
  const focusSessions = state.focusSessions || [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalFocusHours = Math.round((totalFocusMinutes / 60) * 10) / 10;
  const totalFocusSessions = focusSessions.length;
  const streakDays = state.userStreak?.count || 0;

  // Build weekly focus chart data (Mon - Sun)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  // Group focus minutes by day of week
  const weeklyFocusData = daysOfWeek.map((dayLabel, idx) => {
    // Calculate date for that day of current week
    const diff = idx - currentDayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    const dateStr = targetDate.toISOString().split('T')[0];

    const dayMinutes = focusSessions
      .filter(s => {
        if (!s.completedAt) return false;
        const d = new Date(s.completedAt);
        return !isNaN(d.getTime()) && d.toISOString().split('T')[0] === dateStr;
      })
      .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    return { day: dayLabel, minutes: dayMinutes, isToday: idx === currentDayIndex };
  });

  const maxWeeklyMinutes = Math.max(60, ...weeklyFocusData.map(d => d.minutes));

  // Project focus time breakdown
  const projectBreakdown = projects.map(proj => {
    const mins = focusSessions
      .filter(s => Number(s.projectId) === Number(proj.id))
      .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    return { name: proj.name, color: proj.color, minutes: mins };
  }).filter(p => p.minutes > 0);

  // Milestones definitions
  const milestones = [
    {
      id: 'firstTask',
      icon: '🎯',
      title: 'First Step',
      description: 'Complete 1 task',
      unlocked: completedTasks >= 1,
    },
    {
      id: 'taskQuarter',
      icon: '🎯',
      title: 'Task Quarter',
      description: 'Complete 25 tasks',
      unlocked: completedTasks >= 25,
    },
    {
      id: 'streakFlame',
      icon: '🔥',
      title: 'Focus Streak',
      description: 'Reach a 7 day streak',
      unlocked: streakDays >= 7,
    },
    {
      id: 'deepWork',
      icon: '⏱️',
      title: 'Deep Worker',
      description: 'Log 10+ focus hours',
      unlocked: totalFocusHours >= 10,
    },
    {
      id: 'firstProject',
      icon: '🚀',
      title: 'Project Builder',
      description: 'Create your first project',
      unlocked: projects.length >= 1,
    },
    {
      id: 'speedDemon',
      icon: '⚡',
      title: 'Speed Demon',
      description: 'Complete 5 tasks in a single day',
      unlocked: completedTasks >= 5,
    },
    {
      id: 'masterPlanner',
      icon: '💎',
      title: 'Master Planner',
      description: 'Complete 5 high priority tasks',
      unlocked: tasks.filter(t => t.status === 'Done' && t.priority === 'High').length >= 5,
    },
  ];

  return (
    <div className="page-container insights-page">
      <div className="page-header">
        <div>
          <h1>Insights & Analytics</h1>
          <p className="subtext">Understand where your focus and time goes</p>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon completed">✅</div>
          <div className="metric-info">
            <span className="metric-value">{completedTasks}</span>
            <span className="metric-label">Tasks completed</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon rate">📊</div>
          <div className="metric-info">
            <span className="metric-value">{completionRate}%</span>
            <span className="metric-label">Completion rate</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon focus">⏱️</div>
          <div className="metric-info">
            <span className="metric-value">{totalFocusHours}h</span>
            <span className="metric-label">Total focus time</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon remaining">🎯</div>
          <div className="metric-info">
            <span className="metric-value">{totalFocusSessions}</span>
            <span className="metric-label">Focus sessions</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon streak">🔥</div>
          <div className="metric-info">
            <span className="metric-value">{streakDays}</span>
            <span className="metric-label">Current streak</span>
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="visualizations-grid mt-5">
        {/* Weekly Focus Time Bar Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Focus Time This Week</h3>
            <span className="chart-subtext">Minutes per day</span>
          </div>
          <div className="bar-chart-container">
            {weeklyFocusData.map((d, i) => {
              const barHeightPercent = Math.max(8, Math.round((d.minutes / maxWeeklyMinutes) * 100));
              return (
                <div key={i} className="bar-column">
                  <span className="bar-val">{d.minutes > 0 ? `${d.minutes}m` : ''}</span>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${d.isToday ? 'today' : ''}`}
                      style={{ height: `${barHeightPercent}%` }}
                    />
                  </div>
                  <span className={`bar-label ${d.isToday ? 'today-label' : ''}`}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Breakdown & Focus by Project */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Project Breakdown</h3>
            <span className="chart-subtext">Focus minutes by project</span>
          </div>

          <div className="project-breakdown-list">
            {projectBreakdown.length === 0 ? (
              <div className="empty-state-card">
                <p>No logged focus sessions against projects yet.</p>
              </div>
            ) : (
              projectBreakdown.map((p, idx) => (
                <div key={idx} className="project-breakdown-item">
                  <div className="breakdown-info">
                    <span className="color-dot" style={{ backgroundColor: p.color }} />
                    <span className="name">{p.name}</span>
                    <span className="val">{p.minutes} mins</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, (p.minutes / (totalFocusMinutes || 1)) * 100)}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="milestones-section mt-6">
        <div className="section-header">
          <h3>Milestones</h3>
          <span className="section-subtext">Earn achievements as you stay productive</span>
        </div>

        <div className="milestones-grid mt-3">
          {milestones.map((m) => (
            <div key={m.id} className={`milestone-card ${m.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="milestone-icon">{m.icon}</div>
              <div className="milestone-info">
                <h4>{m.title}</h4>
                <p>{m.description}</p>
              </div>
              <span className="status-badge">
                {m.unlocked ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
