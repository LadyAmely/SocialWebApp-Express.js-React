import React from 'react';
import '../css/components/dropmenu.css';
import {useAuth} from "../context/AuthContext";
import Avatar from "react-avatar";


function DropMenu(user_name: string) {

    const { username, setUsername } = useAuth();

    const handleLogout = async () => {
        console.log('Logout button clicked');
        try {
            const response = await fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            console.log('Response Status:', response.status);
            if (response.ok) {
                console.log('Successfully logged out');
                setUsername(null);
                localStorage.removeItem('username');
                window.location.href = '/';
            } else {
                const data = await response.json();
                console.error('Logout error:', data.message);
                alert(`${data.message}`);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return React.createElement(
        'div',
        { className: 'drop-menu' },
        React.createElement(
            'div',
            { className: 'profile-container' },
            React.createElement(
                Avatar,
                {
                    name: user_name,
                    size: '40px',
                    round: true,
                }
            ),
            React.createElement('p', {style: {marginLeft: '10px'}}, user_name)
        ),
        React.createElement(
            'div',
            { className: 'button-container' },
            React.createElement(
                'button',
                { className: 'profile-button', onClick: () => (window.location.href = '/profile'),},
                'Profile'
            ),
            React.createElement(
                'button',
                { className: 'logout-button', onClick: handleLogout },
                'Log out'
            )
        )
    );
}

export default DropMenu;

