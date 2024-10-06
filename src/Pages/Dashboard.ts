import React, {useEffect, useState} from 'react';
import '../css/pages/dashboard.css';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faComments, faUsers, faCalendar, faNewspaper, faCog } from '@fortawesome/free-solid-svg-icons';

function Dashboard(): React.ReactElement {

    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Unknown User';
   // const [users, setUsers] = useState<{ username: string;}[]>([]);
    const [users, setUsers] = useState<string[]>([]);

    /*
    const handleLogout = async () => {
        console.log('Logout button clicked');
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include',
            });

            console.log('Response Status:', response.status);
            if (response.ok) {
                console.log('Successfully logged out');
                window.location.href = '/';
                //navigate('/');
            } else {
                const data = await response.json();
                console.error('Logout error:', data.message);
                alert(`${data.message}`);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

     */

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/users');
                const data = await response.json();
                console.log("Fetched users: ", data);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);



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
        React.Fragment,
        null,
        createHeader(handleLogout),
        React.createElement(
            'div',
            { className: 'main-container' },
            createSidebar(),
            React.createElement(
                'section',
                { className: 'feed' },
                users.map((username) =>
                    createPost(
                        {
                            name: username,
                            avatar: React.createElement(Avatar, { name: username, size: '50', round: true }),
                            time: "3 hours ago",
                        },
                        'Had a great time hiking in the mountains today! 🌄'
                    )
                ),
            ),

            createChatSidebar({name: username, avatar:React.createElement(Avatar, {name: username, size: '50', round: true})}, users)
        )
    );

}


function createHeader(handleLogout: () => void): React.ReactElement {
    return React.createElement(
        'header',
        { className: 'dashboard-header' },
        React.createElement(
            'div',
            { className: 'dashboard-header-left' },
            React.createElement('h1', { className: 'dashboard-logo' }, 'AstronomySocialApp'),
            React.createElement('input', {
                type: 'text',
                className: 'search-bar',
                placeholder: 'Search on AstronomySocialApp'
            })
        ),
        React.createElement(
            'div',
            { className: 'dashboard-header-right' },
            React.createElement(
                'nav',
                { className: 'nav' },
                ['Home', 'Profile', 'Friends', 'Notifications'].map((link) =>
                    React.createElement('a', { href: '#' }, link)
                )
            ),
            React.createElement(
                'button',
                {
                    onClick: handleLogout,
                },
                'Log Out'
            )
        )
    );
}


function createSidebar(): React.ReactElement {
    const menuItems = [
        { name: 'Home', icon: faHome },
        { name: 'My Profile', icon: faUser },
        { name: 'Forum', icon: faComments },
        { name: 'Community', icon: faUsers },
        { name: 'Events', icon: faCalendar },
        { name: 'News', icon: faNewspaper },
        { name: 'Settings', icon: faCog },
    ];
    return React.createElement(
        'aside',
        { className: 'sidebar' },
        React.createElement(
            'ul',
            null,
            menuItems.map((item) =>
                React.createElement(
                    'li',
                    { key: item.name },
                    React.createElement('a', { href: '#' },
                        React.createElement(FontAwesomeIcon, { icon: item.icon, className: 'icon' }),
                        ` ${item.name}`
                    )
                )
            )
        )
    );
}

function createPost(
    user: { name: string; avatar: string | React.ReactNode; time: string },
    content: string
): React.ReactElement {
    return React.createElement(
        'div',
        { className: 'post' },
        React.createElement(
            'div',
            { className: 'post-header' },
            typeof user.avatar === 'string'
                ? React.createElement('img', {
                    src: user.avatar,
                    alt: 'User Avatar',
                    className: 'post-avatar'
                })
                : user.avatar,
            React.createElement(
                'div',
                { className: 'post-user-info' },
                React.createElement('h2', null, user.name),
                React.createElement('span', null, user.time)
            )
        ),
        React.createElement(
            'div',
            { className: 'post-content' },
            React.createElement('p', null, content)
        ),
        React.createElement(
            'div',
            { className: 'post-actions' },
            ['Like', 'Comment', 'Share'].map((action) =>
                React.createElement('button', null, action)
            )
        )
    );
}

function createChatSidebar( user: { name: string; avatar: string | React.ReactNode }, users: string[]): React.ReactElement {
    return React.createElement(
        'aside',
        { className: 'chat-sidebar' },
        React.createElement('h2', null, 'Chats'),
        React.createElement(
            'ul',
            null,
            users.map((username) =>
                React.createElement(
                    'li',
                    { className: 'chat-item'},
                    React.createElement(Avatar, { name: username, size: '40', round: true }),
                    React.createElement('a', { href: '#' }, username)
                )
            ),
        )
    );
}

export default Dashboard;

