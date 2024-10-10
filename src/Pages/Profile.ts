import React, {useEffect, useState} from "react";
import "../css/pages/profile.css";
import "../css/pages/dashboard.css";
import Avatar from 'react-avatar';
import Vibrant from 'node-vibrant';
import { useAuth } from "../context/AuthContext";

function Profile(): React.ReactElement {
    const { username } = useAuth();
    const [imageUrl, setImageUrl] = useState<string>("/best.jpg");
    const [users, setUsers] = useState<string[]>([]);
    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
    const [fileInputKey, setFileInputKey] = useState<number>(0);

    useEffect(() => {
        const storedImageUrl = localStorage.getItem('profileImage');
        if (storedImageUrl) {
            setImageUrl(storedImageUrl);
        } else {
            setImageUrl("/best.jpg");
        }
    }, []);

    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            Vibrant.from(img).getPalette()
                .then(palette => {
                    const dominantColor = palette.Vibrant?.hex || '#ffffff';
                    setBackgroundColor(dominantColor);
                })
                .catch(err => {
                    console.error("Error getting color palette:", err);
                });
        };

        img.onerror = (err) => {
            console.error("Error loading image:", err);
        };
    }, [imageUrl]);

    function handleImageClick() {
        const fileInput = document.getElementById('file-input');
        fileInput?.click();
    }


    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const newImageUrl = URL.createObjectURL(file);
            setImageUrl(newImageUrl);
            localStorage.setItem('profileImage', newImageUrl);
            setFileInputKey(prev => prev + 1);
        }
    }

    function createHeader(): React.ReactElement {
        return React.createElement(
            'header',
            { className: 'dashboard-header' },
            React.createElement(
                'div',
                { className: 'dashboard-header-left' },
                React.createElement('h1', { className: 'dashboard-logo' }, 'GalaxyNET'),
                React.createElement('input', {
                    type: 'text',
                    className: 'search-bar',
                    placeholder: 'Search on GalaxyNET'
                })
            ),
            React.createElement(
                'div',
                { className: 'dashboard-header-right' },
                React.createElement(
                    'nav',
                    { className: 'nav' },

                ),
                React.createElement(
                    'button',
                    null,
                    'Log Out'
                )
            )
        );
    }

    return React.createElement(
        React.Fragment,
        null,
        createHeader(),
        React.createElement("div", { className: "profile" },
            React.createElement("div", { className: "profile-section", style: { backgroundColor: backgroundColor } },
                React.createElement(
                    'div',
                    {className: 'profile-background', style: { backgroundImage: `url(${imageUrl})` }},
                ),
                React.createElement(
                    'div',
                    { className: "profile-image",  onClick: handleImageClick },
                    React.createElement(Avatar, { name: username ?? 'User', size: '100%', round: true }),

                ),
                React.createElement(
                    "input",
                    {
                        id: 'file-input',
                        type: 'file',
                        accept: 'image/*',
                        style: { display: 'none' },
                        key: fileInputKey,
                        onChange: handleFileChange
                    }
                ),
                React.createElement(
                    "div",
                    { className: "profile-container" },

                )
            ),


        )
    );
}

export default Profile;