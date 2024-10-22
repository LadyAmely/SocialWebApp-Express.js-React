import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import "../css/pages/forum.css";
import { useAuth } from '../context/AuthContext';
import { faCog, faComments, faHome, faShare, faThumbsUp, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Post {
    id: number;
    username: string;
    content: string;
    created_at: string;
}

function Forum(): React.ReactElement {
    const { username } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState<string>('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    function createHeader(): React.ReactElement {
        const navItems = [
            { name: 'Home', icon: faHome, href: '/home' },
            { name: 'Profile', icon: faUser, href: '/profile' },
            { name: 'Forum', icon: faComments, href: '/forum' },
            { name: 'Community', icon: faUsers, href: '/community' },
            { name: 'Settings', icon: faCog, href: '/settings' }
        ];

        return React.createElement(
            'header',
            { className: 'dashboard-header' },
            React.createElement(
                'div',
                { className: 'dashboard-header-left' },
                React.createElement('h1', { className: 'dashboard-logo' }, 'GalaxyNET'),
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
                React.createElement(
                    'div',
                    { className: 'dashboard-header-right' },
                    React.createElement(
                        'button',
                        { className: 'logout-button' },
                        'Log Out'
                    )
                )
            )
        );
    }

    const handlePostSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newPostContent, username }),
            });
            if (response.ok) {
                const newPost = await response.json();
                setPosts((prevPosts) => [...prevPosts, newPost]);
                setNewPostContent('');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewPostContent(e.target.value);
    };

    const createPost = (post: Post): React.ReactElement => {
        return React.createElement(
            'div',
            { key: post.id, className: 'post' },
            React.createElement(
                'div',
                { className: 'post-header' },
                React.createElement(
                    'div',
                    { className: 'post-user-info' },
                    React.createElement('h2', null, post.username),
                    React.createElement('span', { className: 'post-date' }, new Date(post.created_at).toLocaleString())
                )
            ),
            React.createElement('div', { className: 'post-content' }, post.content),
            React.createElement(
                'div',
                { className: 'post-actions' },
                React.createElement(
                    'button',
                    { className: 'action-button' },
                    React.createElement(FontAwesomeIcon, { icon: faThumbsUp }),
                    ' Like'
                ),
                React.createElement(
                    'button',
                    { className: 'action-button' },
                    React.createElement(FontAwesomeIcon, { icon: faComments }),
                    ' Comment'
                ),
                React.createElement(
                    'button',
                    { className: 'action-button' },
                    React.createElement(FontAwesomeIcon, { icon: faShare }),
                    ' Share'
                )
            )
        );
    };

    return React.createElement(
        'div',
        { className: 'forum-wrapper' },  // A wrapper for the entire forum, if needed
        createHeader(),  // Header is now outside of forum-container
        React.createElement(
            'div',
            { className: 'forum-container' },
            React.createElement(
                'header',
                { className: 'forum-header' },
                React.createElement('h1', null, 'Discussion Forum'),
                React.createElement('input', {
                    type: 'text',
                    className: 'search-bar',
                    placeholder: 'Search...'
                })
            ),
            React.createElement(
                'div',
                { className: 'new-post' },
                React.createElement('textarea', {
                    value: newPostContent,
                    onChange: handleChange,
                    placeholder: 'Write your post...',
                    className: 'reply-section textarea'
                }),
                React.createElement(
                    'button',
                    { onClick: handlePostSubmit, className: 'reply-section button' },
                    'Post'
                )
            ),
            React.createElement(
                'div',
                { className: 'posts' },
                posts.map((post) => createPost(post))
            )
        )
    );
}

export default Forum;
