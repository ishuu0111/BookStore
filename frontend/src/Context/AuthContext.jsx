import { useState } from 'react';
import { AuthContext } from './auth-context.js';

const getStoredValue = key => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.localStorage.getItem(key);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => getStoredValue('token'));
    const [username, setUsername] = useState(() => getStoredValue('username'));

    const login = (nextToken, nextUsername) => {
        window.localStorage.setItem('token', nextToken);
        window.localStorage.setItem('username', nextUsername);
        setToken(nextToken);
        setUsername(nextUsername);
    };

    const logout = () => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('username');
        setToken(null);
        setUsername(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                isAuthenticated: Boolean(token),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
