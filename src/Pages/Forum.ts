import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/AuthContext";
import {
    faCalendar,
    faCamera,
    faCog,
    faComments,
    faHome,
    faNewspaper,
    faUser,
    faUsers, faVideo
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";
import '../css/pages/dashboard.css';
import '../css/pages/forum.css';
import "../css/pages/profil.css";
import Chat from "../Components/Chat";
import Footer from "../Components/Footer";
import {FaComment, FaShare, FaThumbsUp} from "react-icons/fa";

function Forum() : React.ReactElement{

    const { username, setUsername } = useAuth();
    const displayName = username || 'Unknown User';
    const [comments, setCommentPosts] = useState<any[]>([]);
    const [forumPosts, setForumPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [newPostDescription, setNewPostDescription] = useState<string>("");
    const [newPostTitle, setNewPostTitle] = useState<string>("");

    useEffect(()=>{
        const fetchForumPosts = async() =>{
            try{
                const response = await fetch('http://localhost:5000/api/forum-posts');
                const data = await response.json();
                setForumPosts(data);

            }catch(error){
                console.log(error);
            }
        };
        fetchForumPosts();
    }, []);

    useEffect(()=>{
        const fetchCommentPosts = async() =>{
            try{
                const response = await fetch('http://localhost:5000/api/comment-posts');
                const data = await response.json();
                setCommentPosts(data);

            }catch(error){
                console.log(error);
            }
        };
        fetchCommentPosts();
    }, []);

    const postForumPost = async () => {
        const newPost = {
            title: newPostTitle,
            description: newPostDescription,
            username: username,
            created_at: new Date(),
            updated_at: new Date()
        };

        try {
            const response = await fetch('http://localhost:5000/api/forum-posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                throw new Error('Failed to post data');
            }

            const data = await response.json();
            console.log('Post created successfully:', data);

            setForumPosts([...forumPosts, { ...data, created_at: newPost.created_at, updated_at: newPost.updated_at }]);
            setNewPostDescription('');
            setNewPostTitle('');
        } catch (error) {
            console.error('Error:', error);
        }
    };


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

    const handleUserClick = (user: string) => {
        if (!activeChats.includes(user)) {
            setActiveChats((prevChats) => [...prevChats, user]);
        }
    };

    function createHeader(username: string, handleLogout: () => void): React.ReactElement {
        const navItems = [
            { name: 'Home', icon: faHome, href: '/dashboard' },
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
                            onClick: handleLogout
                        }
                    )
                )
            )
        );
    }


    function createSidebar(): React.ReactElement {
        const menuItems = [
            { name: 'Home', icon: faHome, href: '/dashboard'},
            { name: 'My Profile', icon: faUser, href: '/profile'},
            { name: 'Forum', icon: faComments, href: '/forum' },
            { name: 'Community', icon: faUsers, href: '/community' },
            { name: 'Events', icon: faCalendar, href: '/events' },
            { name: 'News', icon: faNewspaper, href: '/news' },
            { name: 'Settings', icon: faCog, href: '/settings' },
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
            )
        );
    }

    function createChatSidebar(
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

    function createPost(
        user: { name: string; avatar: string | React.ReactNode; time: string },
        content: string,
        image: string,
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
            )

        );
    }


    function createComment(
        user: {name: string, avatar: string | React.ReactNode;},
        content: string,
    ): React.ReactElement{
        return React.createElement(
            'div',
            { className: 'forum-comment' },
            React.createElement(
                'div',
                { className: 'forum-comment-content' },
                content
            )
        )
    }


    function createForumPost(
        user: { name: string; avatar: React.ReactNode },
        title: string,
        content: string,
    ): React.ReactElement {
        return React.createElement(
            'div',
            { className: 'forum-thread' },
            React.createElement('div', { className: 'forum-thread-title' }, title),
            React.createElement('div', { className: 'forum-thread-description' }, content),
            React.createElement(
                'div',
                { className: 'post-actions',  style: { display: 'flex', justifyContent: 'flex-start', gap: '10px' } },
                ['0', '0'].map((action, index) => {
                    const icons = [FaThumbsUp, FaComment];
                    return React.createElement(
                        'button',
                        { key: action,style: {backgroundColor: "transparent"} },
                        React.createElement(icons[index], { style: { marginRight: '5px' } }),
                        action
                    );
                })
            )
        );
    }

    return React.createElement(
        'div',
        React.Fragment,
        createHeader(displayName, handleLogout),
        React.createElement(
            'div',
            {className: 'main-container'},
            createSidebar(),
            React.createElement(
                'section',
                {className: 'feed'},
                React.createElement(
                    'div',
                    {className: 'forum-container'},
                    React.createElement(
                        'div',
                        {className: 'forum-header'},
                        'Astronomy Enthusiasts Forum'
                    ),
                    React.createElement('div', { className: 'create-post-forum' },
                        React.createElement('div', {className: 'post-line'},

                            React.createElement('div', {className: 'post-photo'},
                                React.createElement(Avatar, { name: username ?? 'User', size: '40px', round: true }),
                            ),
                            React.createElement('textarea', { placeholder: "Ask a question",
                                value: newPostTitle,
                                onChange: (e: { target: { value: any; }; }) => setNewPostTitle(e.target.value),

                            },
                                ),

                        ),
                        React.createElement(
                            'textarea',
                            {
                                placeholder: 'Add a description',
                                value: newPostDescription,
                                onChange: (e: { target: { value: React.SetStateAction<string>; }; }) => setNewPostDescription(e.target.value),
                                className: 'post-description-textarea'
                            }
                        ),

                        React.createElement('button', { className: 'post-forum-btn', onClick: postForumPost},  'Publish')
                    ),

                    forumPosts.map((forumPost) => {
                        const postComments = comments.filter(comment => comment.postId === forumPost.id);
                        return createForumPost(
                            {
                                name: forumPost.username,
                                avatar: React.createElement(Avatar, { name: forumPost.username, size: '50', round: true }),
                            },
                            forumPost.title,
                            forumPost.description,


                        );

                    }),

                ),
                React.createElement(
                    'div',
                    { className: 'forum-pagination' },
                    React.createElement(
                        'a',
                        { href: '#', className: 'pagination-link' },
                        '1'
                    ),
                    React.createElement(
                        'a',
                        { href: '#', className: 'pagination-link' },
                        '2'
                    ),
                    React.createElement(
                        'a',
                        { href: '#', className: 'pagination-link' },
                        '3'
                    )
                )
            ),
            createChatSidebar(
                { name: username ?? 'Unknown User', avatar: React.createElement(Avatar, { name: username ?? 'Unknown User', size: '50', round: true }) },
                users,
                activeChats,
                handleUserClick,
                username ?? 'Unknown User'
            ),
        ),
        React.createElement(Footer)
    );

}

export default Forum;