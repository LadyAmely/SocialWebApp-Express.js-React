import React from "react";
import { FaCalendar, FaShare, FaStar } from "react-icons/fa";

interface EventPostProps {
    user: {
        name: string;
        avatar: string | React.ReactNode;
        time: string;
    };
    content: string;
    image: string;
    event_id: number;
}

const EventPost: React.FC<EventPostProps> = ({ user, content, image, event_id }) => {
    return (
        <div className="post" key={event_id}>
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
        <p>{content}</p>
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
        {["Interested", "Calendar", "Share"].map((action, index) => {
        const icons = [FaStar, FaCalendar, FaShare];
        const IconComponent = icons[index];
        return (
            <button key={action}>
            <IconComponent style={{ marginRight: "5px" }} />
        {action}
        </button>
    );
    })}
    </div>
    </div>
);
};

export default EventPost;
