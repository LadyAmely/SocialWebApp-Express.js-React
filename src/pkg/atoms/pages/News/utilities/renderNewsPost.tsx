import NewsPost from "../components/NewsPost";
import Avatar from "react-avatar";

function renderNewsPost(newPosts: Array<{ username: string; created_at: string; description: string; image_path: string; news_id: number }>, displayName: string): React.ReactElement {
    return (
        <>
            {newPosts.map((new_post) => (
                <NewsPost
                    key={new_post.news_id}
                    user={{
                        name: new_post.username,
                        avatar: (
                            <Avatar
                                name={new_post.username}
                                size="50"
                                round={true}
                            />
                        ),
                        time: new Date(new_post.created_at).toLocaleString(),
                    }}
                    content={new_post.description}
                    image={new_post.image_path}
                    postId={new_post.news_id}
                    username={displayName}
                />
            ))}
        </>
    );
}

export default renderNewsPost;