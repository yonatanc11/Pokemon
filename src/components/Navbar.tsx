import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav>
            <span onClick={() => navigate('/')}>Pokédex</span>

            {/* Navigation tabs */}
            <div>
                <button
                    onClick={() => navigate('/')}
                    style={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
                >
                    Home
                </button>
                <button
                    onClick={() => navigate('/favorites')}
                    style={{ fontWeight: location.pathname === '/favorites' ? 'bold' : 'normal' }}
                >
                    Favorites
                </button>
            </div>
        </nav>
    );
}