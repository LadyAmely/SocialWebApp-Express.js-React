import React, { useEffect, useState } from 'react';


import { useAuth } from "../context/AuthContext";


import Avatar from "react-avatar";
import ChatSidebar from "../Components/ChatSidebar";
import ProfileSidebar from "../Components/ProfileSidebar";
import HomeHeader from "../Components/HomeHeader";
import DropMenu from "../Components/DropMenu";


import Sidebar from "../pkg/atoms/components/Sidebar";
import renderFavouriteEvents from "../pkg/atoms/pages/Event/utilities/renderFavouriteEvent";
import renderEventPost from "../pkg/atoms/pages/Event/utilities/renderEventPost";


import '../css/components/posts.css';
import '../css/pages/events.css';

const Events: React.FC = () => {
    const { username } = useAuth();
    const displayName = username || 'Unknown User';
    const [eventPosts, setEventPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);

    const [userGroups, setUserGroup] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [favouriteEvents, setFavouriteEvents] = useState<any[]>([]);

    const [event_id, setEventId] = useState<number | null>(null);
    const [isDropMenu, setDropMenu] = useState(false);

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

    useEffect(() => {
        const fetchEventPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();
                setEventPosts(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchEventPosts();
    }, []);

    const handleUserClick = (user: string) => {
        if (!activeChats.includes(user)) {
            setTargetUser(user);
            setActiveChats((prevChats) => [...prevChats, user]);
        }
    };

    return (
        <div>
            {HomeHeader(displayName, toggleMenuWindow)}
        <div className="main-container">
            <Sidebar userGroups={userGroups} />
            <section className="feed">
                <h2 className="event-text-style">My events</h2>
            <div className="layout">
                <div>{renderFavouriteEvents(favouriteEvents)}</div>
             </div>
                <h2 className="event-text-style">Discover events</h2>
                <div>{renderEventPost(eventPosts)}</div>
            </section>
         <div className="right-container">
                {isDropMenu && DropMenu(displayName)}
            {ProfileSidebar(displayName)}
        {ChatSidebar(
        {
            name: username ?? 'Unknown User',
            avatar: <Avatar name={username ?? 'Unknown User'} size="50" round />,
         },
        users,
            activeChats,
            handleUserClick,
        username ?? 'Unknown User',
            targetUser
    )}
    </div>
    </div>
    </div>
);
};

export default Events;