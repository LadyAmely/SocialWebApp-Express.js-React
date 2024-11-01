import React, {useEffect, useState} from 'react';
import {useAuth} from "../context/AuthContext";
import {faCalendar, faCog, faComments, faHome, faNewspaper, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";
import '../css/pages/dashboard.css';
import '../css/pages/community.css';
import Footer from "../Components/Footer";
import Post from "../Components/Post";
import HomeHeader from "../Components/HomeHeader";
import ProfileSidebar from "../Components/ProfileSidebar";
import ChatSidebar from "../Components/ChatSidebar";
import DropMenu from "../Components/DropMenu";

function Community() : React.ReactElement{

    const { username, setUsername } = useAuth();
    const displayName = username || 'Unknown User';
    const [groupPosts, setGroupPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [userGroups, setUserGroup] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
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

    useEffect(()=>{
        const fetchEventPosts = async() =>{
            try{
                const response = await fetch('http://localhost:5000/api/community');
                const data = await response.json();
                setGroupPosts(data);

            }catch(error){
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
                groupPosts.map((groupPost)=>
                    Post(
                        {
                            name: groupPost.username,
                            avatar: React.createElement(Avatar, { name: groupPost.username, size: '50', round: true }),
                            time: new Date(groupPost.created_at).toLocaleString(),
                        },
                        groupPost.description,
                        groupPost.image_path,
                        groupPost.group_id,
                        displayName
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

export default Community;