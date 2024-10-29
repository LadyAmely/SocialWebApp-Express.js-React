import React, { useEffect } from 'react';

interface FavouriteEventProps {
    username: string | null;
    event_id: number;
}

const FavouriteEvents: React.FC<FavouriteEventProps> = ({ username, event_id }) => {
    useEffect(() => {
        const addFavouriteEvent = async () => {
            if (!username || !event_id) {
                console.error("Username or event ID is missing");
                return;
            }

            try {
                const response = await fetch('/api/favourite_events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, event_id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.error);
                    return;
                }

                const data = await response.json();
                console.log('Favourite event added:', data);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        addFavouriteEvent();
    }, [username, event_id]);
    return null;
};

export default FavouriteEvents;
