import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../main.jsx';

export default function AppLayout() {
  const { token, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <div className="app-shell">
      <header>
        <h1>URL Shortener</h1>
        <nav>
          {token ? (
            <>
              <Link to="/">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
