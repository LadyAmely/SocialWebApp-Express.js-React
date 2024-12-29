import React from 'react';
import "../../../../../css/components/posts.css";
import { FaComment, FaShare, FaThumbsUp } from "react-icons/fa";
import CommentMain from "../../../../../Components/CommentMain";

interface PostProps {
    user: {
        name: string;
        avatar: string | React.ReactNode;
        time: string;
    };
    content: string;
    image: string;
    postId: number;
    username: string;
}

const CommunityPost: React.FC<PostProps> = ({ user, content, image, postId, username }) => {
    return (
        <div className="post">
            <div className="post-header">
                {typeof user.avatar === "string" ? (
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="post-avatar"
                    />
                ) : (
                    user.avatar
                )}
                <div className="post-user-info">
                    <h2>{user.name}</h2>
                    <span>{user.time}</span>
                </div>
            </div>

            <div className="post-content">
                <p style={{ fontSize: '12px' }}>{content}</p>
            </div>

            <div
                className="post-image"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                }}
            ></div>

            <div className="post-actions">
                {["Like", "Comment", "Share"].map((action, index) => {
                    const icons = [FaThumbsUp, FaComment, FaShare];
                    const IconComponent = icons[index];
                    return (
                        <button key={action}>
                            <IconComponent style={{ marginRight: "5px" }} />
                            {action}
                        </button>
                    );
                })}
            </div>

            <CommentMain postId={postId} username={username} />
        </div>
    );
};

export default CommunityPost;
