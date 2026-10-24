import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div className="dash-avatar">{initials}</div>
        <div>
          <h1 className="dash-greeting">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="dash-sub">You are logged in and your session is active.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">✉️</span>
          <div>
            <p className="stat-label">Email</p>
            <p className="stat-value">{user?.email}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div>
            <p className="stat-label">Member since</p>
            <p className="stat-value">{joinDate}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔐</span>
          <div>
            <p className="stat-label">Auth method</p>
            <p className="stat-value">JWT + bcrypt</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🛡️</span>
          <div>
            <p className="stat-label">Session</p>
            <p className="stat-value stat-active">Active</p>
          </div>
        </div>
      </div>

      {user?.bio && (
        <div className="bio-card">
          <p className="bio-label">Bio</p>
          <p className="bio-text">{user.bio}</p>
        </div>
      )}

      <div className="dash-actions">
        <button className="btn btn-primary" onClick={() => navigate('/profile')}>
          Edit profile
        </button>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="token-card">
        <p className="token-label">Protected route confirmed</p>
        <p className="token-desc">
          This dashboard is only accessible with a valid JWT token. If you log out and try to visit
          this URL directly, you will be redirected to the login page.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
