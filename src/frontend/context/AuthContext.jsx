import PropTypes from 'prop-types';
import { createContext, useState, useEffect, useContext } from 'react';
import { authService, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to restore session:', err);
                    setAuthToken(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (telegramUser) => {
        setLoading(true);
        setError(null);
        try {
            // Prepare data matching backend schema.
            // Backend expects: telegram_id, first_name, last_name, username, photo_url
            const authData = {
                telegram_id: String(telegramUser.id),
                first_name: telegramUser.first_name || '',
                last_name: telegramUser.last_name || '',
                username: telegramUser.username || '',
                photo_url: telegramUser.photo_url || ''
            };

            try {
                const data = await authService.login(authData);
                setAuthToken(data.access_token);
                const userData = await authService.getMe();
                setUser(userData);
            } catch (loginErr) {
                // If login fails (maybe user not found), try register
                if (loginErr.response && loginErr.response.status === 404) {
                    const data = await authService.register(authData);
                    setAuthToken(data.access_token);
                    const userData = await authService.getMe();
                    setUser(userData);
                } else {
                    throw loginErr;
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.response?.data?.detail || 'Authentication failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
