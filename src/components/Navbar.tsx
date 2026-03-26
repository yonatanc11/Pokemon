import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.scss';
import logoImage from '../assets/logo.png';
export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
    <nav className={styles.navbar}>
      <img
        src={logoImage}
        alt="Pokemon Logo"
        className={styles.logo}
        onClick={() => navigate('/')}
      />
      <div className={styles.navButtons}>
        <button
          className={`${styles.navButton} ${location.pathname === '/' ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button
          className={`${styles.navButton} ${location.pathname === '/favorites' ? styles.active : ''}`}
          onClick={() => navigate('/favorites')}
        >
          Favorites
        </button>
      </div>
    </nav>
  );
}