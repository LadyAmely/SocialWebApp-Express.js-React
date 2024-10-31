import React from 'react';
import '../css/pages/dashboard.css';
import Avatar from "react-avatar";

function ProfileSidebar(
    username: string
):React.ReactElement{
    return React.createElement(
        'div',
        {className: 'profile-sidebar'},
        React.createElement(
            'div',
            {className: 'background-container'},
        ),
        React.createElement(
            'div',
            {className: 'avatar-container'},
            React.createElement(
                Avatar,
                {
                    name: username,
                    size: '100%',
                    round: true,
                }
            )
        ),
        React.createElement(
            'p',
            null,
            'Welcome back'
        ),
        React.createElement(
            'h3',
            null,
            username
        ),
        React.createElement(
            'button',
            {onClick: () => (window.location.href = '/profile')},
            'Visit your profile'
        )
    )
}

export default ProfileSidebar;