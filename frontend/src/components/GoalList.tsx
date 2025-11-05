import { useState, useEffect } from 'react';
import axios from 'axios';
import { Goal } from '../interfaces/Goal';

const GoalList = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/goals")
      .then(res => {
        console.log("Dữ liệu mục tiêu:", res.data);
        setGoals(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải mục tiêu:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="goals-list">
      <h2>Danh sách mục tiêu</h2>
      {error && <p className="error">{error}</p>}
      <div className="goals-grid">
        {goals.map(goal => (
          <div key={goal.id} className="goal-card">
            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
            <div className="goal-info">
              <span className={`status ${goal.status}`}>{goal.status}</span>
              <span className={`priority ${goal.priority}`}>{goal.priority}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <p className="due-date">Hạn: {new Date(goal.due_date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalList;