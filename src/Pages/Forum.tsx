import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar from "react-avatar";
import "../css/components/dashboard_header.css";
import "../css/pages/forum.css";
import "../css/pages/profil.css";
import CommentForum from "../Components/CommentForum";
import { FaComment, FaShare, FaThumbsUp } from "react-icons/fa";
import HomeHeader from "../Components/HomeHeader";
import Sidebar from "../pkg/atoms/components/Sidebar";
import DropMenu from "../Components/DropMenu";
import ProfileSidebar from "../Components/ProfileSidebar";
import ChatSidebar from "../Components/ChatSidebar";

const Forum: React.FC = () => {
    const { username, setUsername } = useAuth();
    const displayName = username || "Unknown User";
    const [comments, setCommentPosts] = useState<any[]>([]);
    const [forumPosts, setForumPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [activeChats, setActiveChats] = useState<string[]>([]);
    const [newPostDescription, setNewPostDescription] = useState<string>("");
    const [newPostTitle, setNewPostTitle] = useState<string>("");
    const [likes, setLikes] = useState<{ [key: string]: number }>({});
    const [userGroups, setUserGroup] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [targetUser, setTargetUser] = useState<string>("");
    const [isDropMenu, setDropMenu] = useState(false);

    const toggleMenuWindow = () => {
        setDropMenu(!isDropMenu);
    };

    useEffect(() => {
        const fetchForumPosts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/forum-posts");
                const data = await response.json();
                setForumPosts(data);

                const initialLikes = data.reduce((acc: { [key: string]: number }, post: any) => {
                    acc[post.forum_post_id] = post.likes;
                    return acc;
                }, {});
                setLikes(initialLikes);
            } catch (error) {
                console.error("Error fetching forum posts:", error);
            }
        };

        fetchForumPosts();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/auth/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleLike = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/forum-posts/${postId}/like`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setLikes((prevLikes) => ({
                ...prevLikes,
                [postId]: (prevLikes[postId] || 0) + 1,
            }));
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    const createForumPost = (
        user: { name: string; avatar: React.ReactNode },
        title: string,
        content: string,
        postId: number,
        likesCount: number
    ): React.ReactElement => (
        <div className="forum-thread" key={postId}>
        <p className="forum-post-user">by {user.name}</p>
        <div className="forum-thread-title">{title}</div>
            <div className="forum-thread-description">{content}</div>
        <div className="post-actions" style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
        <button
             style={{ backgroundColor: "transparent" }}
        onClick={() => handleLike(postId.toString())}
        >
            <FaThumbsUp style={{ marginRight: "5px" }} /> {likesCount}
        </button>
        <button style={{ backgroundColor: "transparent" }}>
            <FaComment style={{ marginRight: "5px" }} /> Comment
        </button>
        </div>
            <CommentForum postId={postId} username={displayName} />
    </div>
);


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
                    <div className="forum-container">
                        <div className="forum-header">Astronomy Enthusiasts Forum</div>
                        <div className="create-post-forum">
                            <div className="post-line">
                                <Avatar name={username ?? "User"} size="50" round/>
                                <textarea
                                    placeholder="Ask a question"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                />
                            </div>
                            <textarea
                                placeholder="Add a description"
                                value={newPostDescription}
                                onChange={(e) => setNewPostDescription(e.target.value)}
                                className="post-description-textarea"
                            />
                            <button className="post-forum-btn">Publish</button>
                        </div>
                        {forumPosts.map((forumPost) =>
                            createForumPost(
                                {
                                    name: forumPost.username,
                                    avatar: <Avatar name={forumPost.username} size="20" round/>,
                                },
                                forumPost.title,
                                forumPost.description,
                                forumPost.forum_post_id,
                                likes[forumPost.forum_post_id] || 0
                            )
                        )}
                    </div>
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

export default Forum;
