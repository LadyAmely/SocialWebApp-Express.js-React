import React from 'react';
import Avatar from 'react-avatar';
import EventPost from '../components/EventPost';

function renderEventPost(eventPosts: Array<{
    username: string;
    created_at: string;
    description: string;
    image_path: string;
    event_id: number;
}>): React.ReactElement {
    return (
        <div className="event-posts-container">
            {eventPosts.map((event_post) => (
                <EventPost
                    key={event_post.event_id}
                    user={{
                        name: event_post.username,
                        avatar: (
                            <Avatar
                                name={event_post.username}
                                size="40"
                                round={true}
                            />
                        ),
                        time: new Date(event_post.created_at).toLocaleString(),
                    }}
                    content={event_post.description}
                    image={event_post.image_path}
                    event_id={event_post.event_id}
                />
            ))}
        </div>
    );
}

export default renderEventPost;
