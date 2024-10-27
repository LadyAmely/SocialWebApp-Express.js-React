import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/AuthContext";
import {faCalendar, faCog, faComments, faHome, faNewspaper, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";
import '../css/pages/dashboard.css';
import '../css/pages/news.css';
import Chat from "../Components/Chat";
import Footer from "../Components/Footer";
import {FaComment, FaShare, FaThumbsUp} from "react-icons/fa";

function News() : React.ReactElement{

    const { username, setUsername } = useAuth();
    const displayName = username || 'Unknown User';
    const [newPosts, setNewPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [userGroups, setUserGroup] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const fetchUserIdByUsername = async () => {
        try {
            const response = await fetch(`http://localhost:5000/auth/users/user_id?username=${username}`);
            const data = await response.json();

            if (data && data.id) {
                setUserId(data.id);
            } else {
                console.log("Nie znaleziono userId dla podanego username.");
            }
        } catch (error) {
            console.log("Błąd podczas pobierania userId:", error);
        }
    };



    interface UserGroup {
        title: string;
    }



    const fetchUserGroup = async () => {
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:5000/api/user-groups/${userId}`);
            const data = await response.json();
            setUserGroup(data.map((group: UserGroup) => group.title));
        } catch (error) {
            console.log("Wystąpił błąd podczas pobierania grupy użytkownika:", error);
        }
    };

    useEffect(() => {
        if (username) {
            fetchUserIdByUsername();
        }
    }, [username]);



    useEffect(() => {
        fetchUserGroup();
    }, [userId]);




    useEffect(()=>{
        const fetchEventPosts = async() =>{
            try{
                const response = await fetch('http://localhost:5000/api/news');
                const data = await response.json();
                setNewPosts(data);
            }catch(error){
                console.log(error);
            }
        };
        fetchEventPosts();
    }, []);

    function dropMenu(){
        return React.createElement(
            'div',
            {className: 'navbar'}
        );
    }

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
                            onClick: dropMenu
                        }
                    )
                )
            )
        );
    }


    function createSidebar(): React.ReactElement {
        const menuItems = [
            { name: 'Home', icon: faHome, href: '/dashboard'},
            { name: 'Forum', icon: faComments, href: '/forum' },
            { name: 'Community', icon: faUsers, href: '/community' },
            { name: 'Events', icon: faCalendar, href: '/events' },
            { name: 'News', icon: faNewspaper, href: '/news' },
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
                    { key: `group-${index}`, style: { listStyleType: 'none', marginBottom: '10px', display: 'flex', alignItems: 'center' } }, // Ustawienie display na flex, aby wyśrodkować elementy
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

    function createChatSidebar(
        user: { name: string; avatar: string | React.ReactNode },
        users: string[],
        activeChats: string[],
        handleUserClick: (username: string) => void,
        loggedInUser: string
    ): React.ReactElement {
        return React.createElement(
            'aside',
            { className: 'chat-sidebar'},
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

    function createProfileSidebar(
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
                newPosts.map((new_post) =>
                    createPost(
                        {
                            name: new_post.username,
                            avatar: React.createElement(Avatar, { name: new_post.username, size: '50', round: true }),
                            time: new Date(new_post.created_at).toLocaleString(),
                        },
                        new_post.description,
                        new_post.image_path,
                    )
                ),
            ),
            React.createElement(
                'div',
                {className: 'right-container'},
                createProfileSidebar(displayName),
                createChatSidebar(
                    { name: username ?? 'Unknown User', avatar: React.createElement(Avatar, { name: username ?? 'Unknown User', size: '50', round: true }) },
                    users,
                    activeChats,
                    handleUserClick,
                    username ?? 'Unknown User'
                ),
            ),

        ),
        React.createElement(Footer)
    );





}

export default News;