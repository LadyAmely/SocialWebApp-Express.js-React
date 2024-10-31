import React from 'react';
import '../css/pages/dashboard.css';
import Avatar from "react-avatar";
import Chat from "./Chat";

function ChatSidebar(
    user: { name: string; avatar: string | React.ReactNode },
    users: string[],
    activeChats: string[],
    handleUserClick: (username: string) => void,
    loggedInUser: string
): React.ReactElement {
    return React.createElement(
        'aside',
        { className: 'chat-sidebar' },
        React.createElement('h2', null, 'Chats'),
        React.createElement(
            'ul',
            null,
            users
                .filter(username => username !== loggedInUser)
                .map((username) =>
                    React.createElement(
                        'li',
                        {
                            className: 'chat-item',
                            onClick: () => handleUserClick(username),
                        },
                        React.createElement('span', null, loggedInUser === user.name
                            ? React.createElement('div', { className: 'logged-user-circle' })
                            : React.createElement('div', { className: 'unlogged-user-circle' })),
                        React.createElement(Avatar, { name: username, size: '40', round: true }),
                        React.createElement('span', null, username)
                    )
                )
        ),
        React.createElement(
            'div',
            { className: 'chat-windows-container' },
            activeChats.length > 0
                ? activeChats.map((chatUser) =>
                    React.createElement(
                        'div',
                        { className: 'chat-window', key: chatUser },

                        React.createElement(Chat, { user: chatUser })
                    )
                )
                : React.createElement(
                    'div',
                    { className: 'no-chat' },
                    'Select a user to start chatting.'
                )
        )
    );
}

export default ChatSidebar;