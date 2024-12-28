import React from "react";

interface FavouriteEventProps {
    user: { name: string; avatar: string | React.ReactNode; time: string };
    content: string;
    image: string;
    title: string;
    date: string;
    place: string;
}

function FavouriteEvent({ user, content, image, title, date, place }: FavouriteEventProps): React.ReactElement {
    return (
        <div className="grid-event-card">
            <div
                className="grid-image"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>
            <p>{date}</p>
            <h2>{title}</h2>
            <h3 className="grid-event-card-h3">{place}</h3>
        </div>
    );
}

export default FavouriteEvent;
