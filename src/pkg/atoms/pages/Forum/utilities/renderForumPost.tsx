import React from "react";
import ForumPost from "../components/ForumPost";


interface RenderForumPostProps {
    posts: Array<{
        user: { name: string; avatar: React.ReactNode };
        title: string;
        content: string;
        postId: number;
        likesCount: number;
    }>;
    displayName: string;

}

const RenderForumPost: React.FC<RenderForumPostProps> = ({ posts, displayName}) => {
    return (
        <div className="forum-posts-container">
            {posts.map((post) => (
                <ForumPost
                    key={post.postId}
                    user={post.user}
                    title={post.title}
                    content={post.content}
                    postId={post.postId}
                    likesCount={post.likesCount}
                    displayName={displayName}

                />
            ))}
        </div>
    );
};

export default RenderForumPost;
