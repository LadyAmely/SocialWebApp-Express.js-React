import React, { useEffect, useState } from 'react';
import '../css/components/dashboard_header.css';
import Avatar from 'react-avatar';
import { useAuth } from '../context/AuthContext';
import DropMenu from '../Components/DropMenu';
import Sidebar from "../pkg/atoms/components/Sidebar";
import HomeHeader from '../Components/HomeHeader';
import ProfileSidebar from '../Components/ProfileSidebar';
import ChatSidebar from '../Components/ChatSidebar';
import renderCommunityPost from "../pkg/atoms/pages/Community/utilities/renderCommunityPost";

interface UserGroup {
    title: string;
}

const Dashboard: React.FC = (): React.ReactElement => {
    const { username } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isDropMenu, setDropMenu] = useState<boolean>(false);
    const [targetUser, setTargetUser] = useState<string>('');
    const [userGroups, setUserGroup] = useState<string[]>([]);
    const displayName = username || 'Unknown User';

    const toggleMenuWindow = () => {
        setDropMenu(!isDropMenu);
    };

    useEffect(() => {
        const fetchUserGroup = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`http://localhost:5000/api/user-groups/${userId}`);
                const data = await response.json();
                setUserGroup(data.map((group: { title: string }) => group.title));
            } catch (error) {
                console.log("Wystąpił błąd podczas pobierania grupy użytkownika:", error);
            }
        };

        fetchUserGroup();
    }, [userId]);

    const fetchUserIdByUsername = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/auth/users/user_id?username=${username}`
            );
            const data = await response.json();

            if (data && data.id) {
                setUserId(data.id);
            } else {
                console.error('User ID not found for the given username.');
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    useEffect(() => {
        const fetchUserGroups = async () => {
            if (!userId) return;

            try {
                const response = await fetch(
                    `http://localhost:5000/api/user-groups/${userId}`
                );
                const data = await response.json();
                setUserGroup(data.map((group: UserGroup) => group.title));
            } catch (error) {
                console.error('Error fetching user groups:', error);
            }
        };

        fetchUserGroups();
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

    return (
        <div>
            {HomeHeader(displayName, toggleMenuWindow)}
            <div className="main-container">
                <Sidebar userGroups={userGroups} />
                <section className="feed">
                    <div>{renderCommunityPost(posts, displayName)}</div>
                </section>
                <div className="right-container">
                {isDropMenu && DropMenu(displayName)}
                    {ProfileSidebar(displayName)}
                    {ChatSidebar(
                        {
                            name: username ?? 'Unknown User',
                            avatar: <Avatar name={username ?? 'Unknown User'} size="50" round/>,
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

export default Dashboard;
