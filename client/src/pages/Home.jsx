import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-badge">MERN Stack · JWT · bcrypt</div>
        <h1 className="hero-title">
          Secure authentication,<br />
          <span className="hero-accent">done right.</span>
        </h1>
        <p className="hero-sub">
          A complete user authentication system built with MongoDB, Express.js,
          React.js, and Node.js. Register, log in, protect routes — all working.
        </p>
        <div className="hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">Go to dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Get started free</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Log in</Link>
            </>
          )}
        </div>
      </div>

      <div className="features-grid">
        {[
          { icon: '🔑', title: 'JWT authentication', desc: 'Tokens are signed, verified, and auto-attached to every protected request via Axios interceptors.' },
          { icon: '🔒', title: 'bcrypt hashing', desc: 'Passwords are hashed with bcrypt (salt rounds 12) before storage. Plain text never hits the database.' },
          { icon: '🛡️', title: 'Protected routes', desc: 'React routes and Express endpoints both enforce authentication. Unauthenticated users are redirected.' },
          { icon: '✅', title: 'Form validation', desc: 'Client-side and server-side validation on all forms with clear, specific error messages.' },
          { icon: '👤', title: 'User profile', desc: 'View and edit your name, bio, and change your password — all from the profile page.' },
          { icon: '📦', title: 'MongoDB + Mongoose', desc: 'User data is stored in MongoDB with Mongoose schemas, indexes, and automatic timestamps.' },
        ].map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
