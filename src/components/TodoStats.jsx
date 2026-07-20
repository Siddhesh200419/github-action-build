import React from 'react';
import { CheckCircle2, ListTodo } from 'lucide-react';

export default function TodoStats({ total, completed }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Circumference = 2 * PI * 27.5 = 172.78
  const strokeDashoffset = total > 0 ? 172.78 - (172.78 * percentage) / 100 : 172.78;

  let message = "Start adding some tasks to your day!";
  if (total > 0) {
    if (percentage === 100) {
      message = "Outstanding! You've cleared all your tasks. 🎉";
    } else if (percentage >= 75) {
      message = "Almost there! Keep pushing. 🚀";
    } else if (percentage >= 50) {
      message = "Halfway done! Excellent progress. 💪";
    } else {
      message = "Step by step, you've got this. ⚡";
    }
  }

  return (
    <div className="stats-container" id="todo-stats-widget">
      <div className="stats-circle-wrapper">
        <svg className="stats-circle-svg">
          <defs>
            <linearGradient id="statsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
          </defs>
          <circle className="stats-circle-bg" cx="30" cy="30" r="27.5" />
          <circle 
            className="stats-circle-fill" 
            cx="30" 
            cy="30" 
            r="27.5" 
            style={{ strokeDashoffset }}
          />
        </svg>
        <div className="stats-circle-text">{percentage}%</div>
      </div>
      
      <div className="stats-info">
        <h3 className="stats-title">{message}</h3>
        <p className="stats-caption">Your daily checklist progress</p>
      </div>

      <div className="stats-breakdown">
        <div className="stat-pill" id="stat-completed-pill">
          <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', marginTop: '-2px' }} />
          <span>{completed} Done</span>
        </div>
        <div className="stat-pill" id="stat-pending-pill">
          <ListTodo size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', marginTop: '-2px' }} />
          <span>{total - completed} Pending</span>
        </div>
      </div>
    </div>
  );
}
