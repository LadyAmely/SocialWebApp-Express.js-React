import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/AuthContext";
import {faCalendar, faCog, faComments, faHome, faNewspaper, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";
import '../css/pages/dashboard.css';
import '../css/pages/events.css';
import Chat from "../Components/Chat";
import Footer from "../Components/Footer";
import FavouriteEvents from "../Components/FavouriteEvents";
import {FaCalendar, FaComment, FaShare, FaStar, FaThumbsUp} from "react-icons/fa";
import ChatSidebar from "../Components/ChatSidebar";
import ProfileSidebar from "../Components/ProfileSidebar";
import HomeHeader from "../Components/HomeHeader";
import DropMenu from "../Components/DropMenu";


function Events() : React.ReactElement{

    const { username, setUsername } = useAuth();
    const displayName = username || 'Unknown User';
    const [eventPosts, setEventPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [userGroups, setUserGroup] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [favouriteEvents, setFavouriteEvents] = useState<any[]>([]);
    const [event_id, setEventId] = useState<number | null>(null);
    const [isDropMenu, setDropMenu] = React.useState(false);

    const [targetUser, setTargetUser] = useState<string>("");

    const toggleMenuWindow = () => {
        setDropMenu(!isDropMenu);
    };

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



    interface UserGroup {
        title: string;
    }

    useEffect(() => {
        const fetchFavouriteEvents = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/favourite_events/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch favourite events');
                }
                const data = await response.json();
                setFavouriteEvents(data);
            } catch (error) {
                console.error("Error fetching favourite events:", error);
            }
        };

        if (username) {
            fetchFavouriteEvents();
        }
    }, [username]);



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
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();
                setEventPosts(data);

            }catch(error){
                console.log(error);
            }
        };
        fetchEventPosts();
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
            setTargetUser(user);
            setActiveChats((prevChats) => [...prevChats, user]);
        }
    };


    const handleSelectEvent = (id: number) => {
        setEventId(id);
    };




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


    function createFavouriteEvent(
        user: { name: string; avatar: string | React.ReactNode; time: string },
        content: string,
        image: string,
        title: string,
        date: string,
        place: string,
    ):React.ReactElement{
        return React.createElement(
            'div',
            {className: 'grid-event-card'},
            React.createElement(
                'div',
                {className:'grid-image', style: { backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',}},

            ),
            React.createElement(
                'p',
                null,
                date
            ),
            React.createElement(
              'h2',
              null,
                title
            ),
            React.createElement(
                'h3',
                {className: 'grid-event-card-h3'},
                place
            )
        )

    }



    function createPost(
        user: { name: string; avatar: string | React.ReactNode; time: string },
        content: string,
        image: string,
        event_id: number,
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
                ['Interested', 'Calendar', 'Share'].map((action, index) => {
                    const icons = [FaStar,FaCalendar, FaShare];
                    return React.createElement(
                        'button',
                        {
                            key: action,
                        },
                        React.createElement(icons[index], { style: { marginRight: '5px' } }),
                        action,

                    );
                })
            )

        );
    }


    return React.createElement(
      'div',
      React.Fragment,
      HomeHeader(displayName, toggleMenuWindow),
        React.createElement(
            'div',
            {className: 'main-container'},
            createSidebar(),
            React.createElement(
                'section',
                {className: 'feed'},
                React.createElement('h2', {className: "event-text-style"}, 'My events'),
                React.createElement('div', {className: 'layout'},
                        favouriteEvents.map((my_event)=>createFavouriteEvent(
                            {name: my_event.username,
                                avatar: React.createElement(Avatar, { name: my_event.username, size: '50', round: true }),
                                time: new Date(my_event.created_at).toLocaleString(),
                                },
                            my_event.description,
                            my_event.image_path,
                            my_event.title,
                            my_event.date_of_event,
                            my_event.place_of_event,
                            )
                        ),
                    ),
                React.createElement('h2', {className: 'event-text-style'}, 'Discover events'),
                eventPosts.map((event_post) =>
                    createPost(
                        {
                            name: event_post.username,
                            avatar: React.createElement(Avatar, { name: event_post.username, size: '50', round: true }),
                            time: new Date(event_post.created_at).toLocaleString(),
                        },
                        event_post.description,
                        event_post.image_path,
                        event_post.event_id,
                    )
                ),
            ),
            React.createElement(
              'div',
                {className: 'right-container'},
                isDropMenu && DropMenu(displayName),
                ProfileSidebar(displayName),
                ChatSidebar(
                    { name: username ?? 'Unknown User', avatar: React.createElement(Avatar, { name: username ?? 'Unknown User', size: '50', round: true }) },
                    users,
                    activeChats,
                    handleUserClick,
                    username ?? 'Unknown User',
                    targetUser
                ),
            ),

        ),
        React.createElement(Footer)
    );
}

export default Events;