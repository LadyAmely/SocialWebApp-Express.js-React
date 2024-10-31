import React from 'react';
import '../css/pages/dashboard.css';
import {faCalendar, faComments, faHome, faNewspaper, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";


function Sidebar(userGroups: string[]): React.ReactElement{

    const menuItems = [
        { name: 'Home', icon: faHome, href:'/dashboard' },
        { name: 'Forum', icon: faComments, href: '/forum' },
        { name: 'Community', icon: faUsers, href: '/community' },
        { name: 'Events', icon: faCalendar, href: '/events' },
        { name: 'News', icon: faNewspaper , href: '/news'},
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
                    React.createElement('a', { href: item.href },
                        React.createElement(FontAwesomeIcon, { icon: item.icon, className: 'icon' }),
                        ` ${item.name}`
                    )
                )
            )
        ),
        React.createElement(
            'p',
            {className: 'text-group'},
            'Your groups'
        ),
        userGroups.map((groupTitle, index) =>
            React.createElement(
                'li',
                { key: `group-${index}`, style: { listStyleType: 'none', marginBottom: '10px', display: 'flex', alignItems: 'center' } },
                React.createElement(
                    Avatar,
                    {
                        name: groupTitle,
                        size: '40',
                        round: true,
                    }
                ),
                React.createElement(
                    'span',
                    { style: { marginLeft: '10px', color: 'rgba(200, 220, 230, 0.6)' } },
                    groupTitle
                )
            ),
        )
    );

}

export default Sidebar;