import React from 'react';
import Avatar from 'react-avatar';
import FavouriteEvent from '../components/FavouriteEvent';

interface FavouriteEventData {
    username: string;
    created_at: string;
    description: string;
    image_path: string;
    title: string;
    date_of_event: string;
    place_of_event: string;
}

function renderFavouriteEvents(favouriteEvents: FavouriteEventData[]): React.ReactElement {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
    {favouriteEvents.map((my_event) => (
        <FavouriteEvent
            key={my_event.title}
        user={{
        name: my_event.username,
            avatar: (
            <Avatar
                name={my_event.username}
        size="40"
        round={true}
        />
    ),
        time: new Date(my_event.created_at).toLocaleString(),
    }}
        content={my_event.description}
        image={my_event.image_path}
        title={my_event.title}
        date={my_event.date_of_event}
        place={my_event.place_of_event}
        />
    ))}
    </div>
);
}

export default renderFavouriteEvents;
