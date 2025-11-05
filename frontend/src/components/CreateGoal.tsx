import { useState } from 'react';
import axios from 'axios';
import { Goal } from '../interfaces/Goal';

const CreateGoal = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/goals', formData);
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
      });
      // TODO: Add success notification
    } catch (error) {
      console.error('Lỗi khi tạo mục tiêu:', error);
      // TODO: Add error notification
    }
  };

  return (
    <div className="create-goal">
      <h2>Tạo mục tiêu mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="due_date">Hạn hoàn thành</label>
          <input
            type="date"
            id="due_date"
            value={formData.due_date}
            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Độ ưu tiên</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>
        <button type="submit">Tạo mục tiêu</button>
      </form>
    </div>
  );
};

export default CreateGoal;