
import Avatar from "react-avatar";
import React from "react";
import CommunityPost from "../components/CommunityPost";


const renderCommunityPost = (groupPosts: Array<{ username: string; created_at: string; description: string; image_path: string; group_id: number }>, displayName: string): React.ReactElement[] => {
    return groupPosts.map((groupPost) => (
        <CommunityPost
            key={groupPost.group_id}
            user={{
                name: groupPost.username,
                avatar: <Avatar name={groupPost.username} size="40" round={true} />,
                time: new Date(groupPost.created_at).toLocaleString(),
            }}
            content={groupPost.description}
            image={groupPost.image_path}
            postId={groupPost.group_id}
            username={displayName}
        />
    ));
};

export default renderCommunityPost;