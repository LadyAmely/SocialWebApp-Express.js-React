
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    username: string | null;
    setUsername: (username: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

    return React.createElement(
        AuthContext.Provider,
        { value: { username, setUsername } },
        children
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
