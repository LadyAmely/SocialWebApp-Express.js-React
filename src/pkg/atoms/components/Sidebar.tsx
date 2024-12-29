import React from "react";
import { faCalendar, faComments, faHome, faNewspaper, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";

interface SidebarProps {
    userGroups: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ userGroups }) => {
    const menuItems = [
        { name: "Home", icon: faHome, href: "/dashboard" },
        { name: "Forum", icon: faComments, href: "/forum" },
        { name: "Community", icon: faUsers, href: "/community" },
        { name: "Events", icon: faCalendar, href: "/events" },
        { name: "News", icon: faNewspaper, href: "/news" },
    ];

    return (
        <aside className="sidebar">
            <ul>
                {menuItems.map((item) => (
                        <li key={item.name}>
                        <a href={item.href}>
                        <FontAwesomeIcon icon={item.icon} className="icon" /> {item.name}
                    </a>
                    </li>
    ))}
    </ul>

    <p className="text-group">Your groups</p>

    {userGroups.map((groupTitle, index) => (
        <li
            key={`group-${index}`}
        style={{
        listStyleType: "none",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
    }}
    >
        <Avatar name={groupTitle} size="20" round={true} />
    <span
        style={{
        marginLeft: "10px",
            color: "rgba(200, 220, 230, 0.6)",
    }}
    >
        {groupTitle}
        </span>
        </li>
    ))}
    </aside>
);
};

export default Sidebar;
