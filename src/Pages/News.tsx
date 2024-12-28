import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import Avatar from "react-avatar";
import "../css/pages/dashboard.css";
import "../css/pages/news.css";
import HomeHeader from "../Components/HomeHeader";
import renderNewsPost from "../pkg/atoms/pages/News/utilities/renderNewsPost";
import Sidebar from "../pkg/atoms/components/Sidebar";
import ProfileSidebar from "../Components/ProfileSidebar";
import DropMenu from "../Components/DropMenu";
import ChatSidebar from "../Components/ChatSidebar";


const News: React.FC = () => {
    const { username } = useAuth();
    const displayName = username || "Unknown User";
    const [newPosts, setNewPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [userGroups, setUserGroup] = useState<string[]>([]);

    const [userId, setUserId] = useState<string | null>(null);
    const [targetUser, setTargetUser] = useState<string>("");
    const [isDropMenu, setDropMenu] = useState(false);

    const toggleMenuWindow = () => {
        setDropMenu(!isDropMenu);
    };

    interface UserGroup {
        title: string;
    }


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
                const response = await fetch("http://localhost:5000/auth/users");
                const data = await response.json();
                console.log("Fetched users: ", data);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (username) {
            fetchUserIdByUsername();
        }
    }, [username]);

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

    useEffect(() => {
        const fetchEventPosts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/news");
                const data = await response.json();
                setNewPosts(data);
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
                <Sidebar userGroups={userGroups}/>
                <section className="feed">
                    <div>{renderNewsPost(newPosts, displayName)}</div>
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

export default News;
