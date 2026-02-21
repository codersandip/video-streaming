import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, LogOut, User, LayoutDashboard, CreditCard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: '1rem',
      margin: '0 1rem',
      zIndex: 1000,
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '1rem'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          padding: '0.5rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Play size={20} fill="white" color="white" />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Stream<span style={{ color: 'var(--primary)' }}>Vault</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="nav-link">Explore</Link>
        <Link to="/subscriptions" className="nav-link">Plans</Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                <LayoutDashboard size={18} />
                Admin
              </Link>
            )}
            <div className="user-menu" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--surface-light)', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                  <User size={20} style={{ margin: 'auto' }} />
                </div>
                <span style={{ fontWeight: 600 }}>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none', background: 'transparent' }}>
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Join Now</Link>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .nav-link {
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: var(--text);
        }
      `}} />
    </nav >
  );
};

export default Navbar;
