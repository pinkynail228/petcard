import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [devTelegramId, setDevTelegramId] = useState('');

    useEffect(() => {
        // Check for Telegram WebApp context
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            const user = tg.initDataUnsafe?.user;
            if (user) {
                handleLogin(user);
            }
        }
    }, []);

    const handleLogin = async (userData) => {
        try {
            await login(userData);
            navigate('/');
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    const handleDevLogin = (e) => {
        e.preventDefault();
        // Simulate Telegram user object
        const mockUser = {
            id: devTelegramId,
            first_name: 'Dev',
            last_name: 'User',
            username: 'dev_user',
        };
        handleLogin(mockUser);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>PetCard Login</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!window.Telegram?.WebApp?.initDataUnsafe?.user && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Development Login</h3>
                    <p>Enter a mock Telegram ID (since we are not in Telegram)</p>
                    <form onSubmit={handleDevLogin}>
                        <input
                            type="text"
                            value={devTelegramId}
                            onChange={(e) => setDevTelegramId(e.target.value)}
                            placeholder="Telegram ID"
                            style={{ padding: '8px', fontSize: '16px' }}
                        />
                        <button type="submit" style={{ marginLeft: '10px', padding: '8px 16px' }}>
                            Login
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginScreen;
