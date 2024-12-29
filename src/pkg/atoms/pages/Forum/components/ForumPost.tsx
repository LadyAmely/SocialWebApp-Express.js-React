import React from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import CommentForum from "../../../../../Components/CommentForum";


interface ForumPostProps {
    user: { name: string; avatar: React.ReactNode };
    title: string;
    content: string;
    postId: number;
    likesCount: number;
    displayName: string;

}

const ForumPost: React.FC<ForumPostProps> = ({
                                                 user,
                                                 title,
                                                 content,
                                                 postId,
                                                 likesCount,
                                                 displayName
                                             }) => {
    return (
        <div className="forum-thread" key={postId}>
            <p className="forum-post-user">by {user.name}</p>
            <div className="forum-thread-title">{title}</div>
            <div className="forum-thread-description">{content}</div>
            <div
                className="post-actions"
                style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}
            >
                <button
                    style={{ backgroundColor: "transparent" }}

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
};

export default ForumPost;
