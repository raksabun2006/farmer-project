import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Optimization: Initialize state directly from localStorage so user context is ready instantly
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        return null;
    });

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (

        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export  const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            'useAuth must be used inside an <AuthProvider>. ' +
            'Ensure you have wrapped your application tree (in main.jsx or App.jsx) with <AuthProvider>.'
        );
    }
    return context;
};