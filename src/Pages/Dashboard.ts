import React, {useEffect, useState} from 'react';
import '../css/pages/dashboard.css';
import Avatar from 'react-avatar';
import { useAuth } from '../context/AuthContext';
import Footer from "../Components/Footer";
import DropMenu from "../Components/DropMenu";
import Sidebar from "../Components/Sidebar";
import HomeHeader from "../Components/HomeHeader";
import Post from "../Components/Post";
import ProfileSidebar from "../Components/ProfileSidebar";
import ChatSidebar from "../Components/ChatSidebar";

function Dashboard(): React.ReactElement {
    const { username, setUsername } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const displayName = username || 'Unknown User';
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

    useEffect(()=>{

        const fetchUserGroup = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`http://localhost:5000/api/user-groups/${userId}`);
                const data = await response.json();
                setUserGroup(data.map((group: UserGroup) => group.title));
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserGroup();

    }, [userId]);



    useEffect(() => {
        if (username) {
            fetchUserIdByUsername();
        }
    }, [username]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

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


    const handleUserClick = (user: string) => {
        if (!activeChats.includes(user)) {
            setTargetUser(user);
            setActiveChats((prevChats) => [...prevChats, user]);
        }
    };

    return React.createElement(
        React.Fragment,
        null,
        HomeHeader(displayName, toggleMenuWindow),
        React.createElement(
            'div',
            { className: 'main-container' },
            Sidebar(userGroups),
            React.createElement(
                'section',
                { className: 'feed' },
                posts.map((post) =>
                    Post(
                        {
                            name: post.username,
                            avatar: React.createElement(Avatar, { name: post.username, size: '50', round: true }),
                            time: new Date(post.created_at).toLocaleString(),
                        },
                        post.description,
                        post.image_path,
                        post.post_id,
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


export default Dashboard;
