import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../Context/auth-context.js';

function NavBar() {
    const { username, logout, isAuthenticated } = useContext(AuthContext);

    return (
        <header className="topbar">
            <div className="topbar__inner">
                <NavLink to="/" className="brand">
                    <span className="brand__mark">L</span>
                    <span>
                        <strong>Leaf & Ledger</strong>
                        <small>Curated stories and timeless reads</small>
                    </span>
                </NavLink>

                <nav className="topbar__nav" aria-label="Primary">
                    <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
                        Discover
                    </NavLink>
                    <NavLink to="/add" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
                        Sell a Book
                    </NavLink>
                    {isAuthenticated ? (
                        <div className="topbar__user">
                            <span className="user-pill">Hello, {username}</span>
                            <button type="button" className="button button--ghost" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="topbar__auth">
                            <NavLink
                                to="/login"
                                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                            >
                                Login
                            </NavLink>
                            <NavLink to="/register" className="button button--primary">
                                Join Free
                            </NavLink>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default NavBar;
