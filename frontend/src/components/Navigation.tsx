import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav style={{ marginBottom: '20px' }}>
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
        <li>
          <Link to="/">Bảng điều khiển</Link>
        </li>
        <li>
          <Link to="/goals">Mục tiêu</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;