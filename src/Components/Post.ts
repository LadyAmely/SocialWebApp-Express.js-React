import React from 'react';
import "../css/pages/dashboard.css";
import {FaComment, FaShare, FaThumbsUp} from "react-icons/fa";
import CommentMain from "./CommentMain";

function Post(
    user: { name: string; avatar: string | React.ReactNode; time: string },
    content: string,
    image: string,
    postId: number,
    username: string,
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
                React.createElement('span', null, user.time),
            )
        ),
        React.createElement(
            'div',
            { className: 'post-content' },
            React.createElement('p', null, content)
        ),
        React.createElement(
            'div',
            {
                className: 'post-image',
                style: {
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '200px',
                }
            }
        ),

        React.createElement(
            'div',
            { className: 'post-actions' },
            ['Like', 'Comment', 'Share'].map((action, index) => {
                const icons = [FaThumbsUp, FaComment, FaShare];
                return React.createElement(
                    'button',
                    { key: action },
                    React.createElement(icons[index], { style: { marginRight: '5px' } }),
                    action
                );
            })
        ),
        React.createElement(CommentMain,  { postId, username }),

    );
}

export default Post;