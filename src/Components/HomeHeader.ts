import React from 'react';
import "../css/pages/dashboard.css";
import {faComments, faHome, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";


function HomeHeader(username: string, toggleMenuWindow: () => void): React.ReactElement {
    const navItems = [
        { name: 'Home', icon: faHome, href: '/dashboard' },
        { name: 'Profile', icon: faUser, href: '/profile' },
        { name: 'Forum', icon: faComments, href: '/forum' },
        { name: 'Community', icon: faUsers, href: '/community' },
    ];

    return React.createElement(
        'header',
        { className: 'dashboard-header' },
        React.createElement(
            'div',
            { className: 'dashboard-header-left' },
            React.createElement('h1', { className: 'dashboard-logo' }, 'GalaxyFlow'),
        ),
        React.createElement(
            'div',
            { className: 'dashboard-header-center' },
            React.createElement(
                'nav',
                { className: 'nav' },
                React.createElement(
                    'ul',
                    null,
                    navItems.map(item =>
                        React.createElement(
                            'li',
                            { key: item.name, className: 'nav-item' },
                            React.createElement(
                                'a',
                                { href: item.href, className: 'nav-link' },
                                React.createElement(FontAwesomeIcon, { icon: item.icon, className: 'icon' }),
                            )
                        )
                    )
                )
            ),
            React.createElement('div',
                { className: 'dashboard-header-left' },
                React.createElement(
                    Avatar,
                    {
                        name: username,
                        size: '40',
                        round: true,
                        onClick: toggleMenuWindow
                    }
                )
            ),
        ),
    );
}

export default HomeHeader;