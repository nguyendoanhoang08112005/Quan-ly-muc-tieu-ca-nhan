const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Bảng điều khiển</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Mục tiêu đang thực hiện</h3>
          <p className="stat-number">0</p>
        </div>
        <div className="stat-card">
          <h3>Mục tiêu đã hoàn thành</h3>
          <p className="stat-number">0</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số nhiệm vụ</h3>
          <p className="stat-number">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;