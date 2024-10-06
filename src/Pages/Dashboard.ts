import React from 'react';
import '../css/pages/dashboard.css';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';


function Dashboard(): React.ReactElement {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Unknown User';

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
                createPost(
                    { name: username, avatar: 'avatar.jpg', time: '2 hours ago' },
                    'Had a great time hiking in the mountains today! 🌄'
                ),
                createPost(
                    { name: 'Jane Smith', avatar: 'avatar.jpg', time: '5 hours ago' },
                    "Can't wait for the weekend! 🎉"
                )
            ),
            createChatSidebar()
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
            React.createElement('h1', { className: 'dashboard-logo' }, 'SocialApp'),
            React.createElement('input', {
                type: 'text',
                className: 'search-bar',
                placeholder: 'Search on SocialApp'
            })
        ),
        React.createElement(
            'div',
            { className: 'dashboard-header-right' },
            React.createElement(
                'nav',
                { className: 'nav' },
                ['Home', 'Profile', 'Friends', 'Messages', 'Notifications'].map((link) =>
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
    return React.createElement(
        'aside',
        { className: 'sidebar' },
        React.createElement(
            'ul',
            null,
            ['Home', 'My Profile', 'Friends', 'Groups', 'Marketplace', 'Watch', 'Memories'].map((item) =>
                React.createElement(
                    'li',
                    null,
                    React.createElement('a', { href: '#' }, item)
                )
            )
        )
    );
}

function createPost(
    user: { name: string; avatar: string; time: string },
    content: string
): React.ReactElement {
    return React.createElement(
        'div',
        { className: 'post' },
        React.createElement(
            'div',
            { className: 'post-header' },
            React.createElement('img', {
                src: user.avatar,
                alt: 'User Avatar',
                className: 'post-avatar'
            }),
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

function createChatSidebar(): React.ReactElement {
    return React.createElement(
        'aside',
        { className: 'chat-sidebar' },
        React.createElement('h2', null, 'Chats'),
        React.createElement(
            'ul',
            null,
            ['Sarah', 'Michael', 'Emily'].map((friend) =>
                React.createElement(
                    'li',
                    null,
                    React.createElement('a', { href: '#' }, friend)
                )
            )
        )
    );
}

export default Dashboard;
