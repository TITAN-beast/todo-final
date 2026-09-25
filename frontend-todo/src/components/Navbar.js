import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" id="app-navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? '/todos' : '/login'} className="navbar-brand" id="nav-brand-logo">
          <div className="brand-icon">
            <CheckSquare size={20} />
          </div>
          <span className="brand-text">TaskFlow</span>
          <span className="brand-badge">FullStack</span>
        </Link>

        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <>
              <div className="user-badge" id="nav-user-badge">
                <div className="user-avatar" title={user.email}>
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                <span className="user-name">{user.name || user.email}</span>
              </div>

              <button
                type="button"
                className="btn-logout"
                id="btn-nav-logout"
                onClick={handleLogout}
                title="Log out of your account"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="nav-auth-links">
              <Link to="/login" className="btn-icon" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} id="nav-link-login">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
