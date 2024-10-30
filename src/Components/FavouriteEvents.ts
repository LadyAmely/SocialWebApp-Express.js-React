import React, { useEffect } from 'react';

interface FavouriteEventProps {
    username: string | null;
    event_id: number;
}

const FavouriteEvents: React.FC<FavouriteEventProps> = ({ username, event_id }) => {
    const [isAdded, setIsAdded] = React.useState(false);

    useEffect(() => {
        const addFavouriteEvent = async () => {
            if (!username || !event_id || isAdded) return;

            try {
                const response = await fetch('/api/favourite_events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, event_id }),
                });

                if (response.ok) {
                    setIsAdded(true);
                    const data = await response.json();
                    console.log('Wydarzenie dodane do ulubionych:', data);
                } else {
                    const errorData = await response.json();
                    console.error('Błąd:', errorData.error);
                }
            } catch (error) {
                console.error('Błąd podczas fetch:', error);
            }
        };

        addFavouriteEvent();
    }, [username, event_id, isAdded]);

    return null;
};

export default FavouriteEvents;
