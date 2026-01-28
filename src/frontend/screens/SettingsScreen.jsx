import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px' }}>
            <header style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '10px' }}
                >
                    ←
                </button>
                <h1>Settings</h1>
            </header>

            <div style={{ marginBottom: '30px' }}>
                <h3>Account</h3>
                <p>Telegram ID: {user?.telegram_id}</p>
                <p>Name: {user?.first_name} {user?.last_name}</p>
            </div>

            <button
                onClick={logout}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px'
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default SettingsScreen;
