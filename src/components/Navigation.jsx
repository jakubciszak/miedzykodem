import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">Między kodem, a kulturą</Link>
      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/blog" className={location.pathname.startsWith('/blog') ? 'active' : ''}>Blog</Link></li>
        </ul>
        <a href="/feed.xml" className="nav-rss" title="RSS Feed" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <circle cx="6.18" cy="17.82" r="2.18"/>
            <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}
