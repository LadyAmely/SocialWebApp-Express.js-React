import React, { useEffect, useState } from "react";
import Avatar from 'react-avatar';
import Vibrant from 'node-vibrant';
import { useAuth } from "../context/AuthContext";
import "../css/pages/profil.css";
import {faCog, faComments, faHome, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCamera, faVideo, faCalendar } from '@fortawesome/free-solid-svg-icons';

function Profil(): React.ReactElement {
    const { username } = useAuth();
    const [imageUrl, setImageUrl] = useState<string>("/best.jpg");
    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
    const [fileInputKey, setFileInputKey] = useState<number>(0);


    useEffect(() => {
        const storedImageUrl = localStorage.getItem('profileImage');
        if (storedImageUrl) {
            setImageUrl(storedImageUrl);
        }
    }, []);

    function createHeader(): React.ReactElement {
        const navItems = [
            { name: 'Home', icon: faHome, href: '/home' },
            { name: 'Profile', icon: faUser, href: '/profile' },
            { name: 'Forum', icon: faComments, href: '/forum' },
            { name: 'Community', icon: faUsers, href: '/community' },
            { name: 'Settings', icon: faCog, href: '/settings' }
        ];

        return React.createElement(
            'header',
            { className: 'dashboard-header' },
            React.createElement(
                'div',
                { className: 'dashboard-header-left' },
                React.createElement('h1', { className: 'dashboard-logo' }, 'GalaxyNET'),
            ),
            React.createElement(
                'div',
                { className: 'dashboard-header-center' },
                React.createElement(
                    'nav',
                    { className: 'nav' },
                    React.createElement(
                        'ul',
                        null,
                        navItems.map(item =>
                            React.createElement(
                                'li',
                                { key: item.name, className: 'nav-item' },
                                React.createElement(
                                    'a',
                                    { href: item.href, className: 'nav-link' },
                                    React.createElement(FontAwesomeIcon, { icon: item.icon, className: 'icon' }),
                                )
                            )
                        )
                    )
                ),
                React.createElement('div',
                    {className: 'dashboard-header-left'},
                    React.createElement(
                        'button',
                        {
                            className: 'logout-button'
                        },
                        ' Log Out'
                    )

                )

            )
        );
    }


    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            Vibrant.from(img).getPalette()
                .then(palette => {
                    const dominantColor = palette.Vibrant?.hex || '#75a7d8';
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
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
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


    const profileSection = React.createElement(
        'div',
        { className: 'profile-section'},
        React.createElement(
            'div',
            {className: 'profile-transparent'},


            React.createElement('div', {className: 'profile-gradient'},
                React.createElement('div', {className: 'profile-transparent-container'},
                    React.createElement(
                        'div',
                        { className: 'profile-header' },
                        React.createElement(
                            'div',
                            {
                                className: 'background-image'
                            },

                        ),
                        React.createElement(
                            'div',
                            { className: 'profile-info' },
                            React.createElement(
                                'div',
                                { className: 'profile-photo', onClick: handleImageClick },
                                React.createElement(Avatar, { name: username ?? 'User', size: '100%', round: true })
                            ),
                            React.createElement(
                                'input',
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
                                'div',
                                { className: 'profile-name' },
                                React.createElement('h2', null, username ?? 'User')
                            )
                        )
                    ),




                ),


            ),
            React.createElement('div', {className: 'profile-dark-container'},

                React.createElement('div', {className: 'user-card'}),

                React.createElement('div', { className: 'create-post' },
                    React.createElement('div', {className:'post-title'}, 'Create post'),
                    React.createElement('div', {className: 'post-line'},

                        React.createElement('div', {className: 'post-photo'},
                            React.createElement(Avatar, { name: username ?? 'User', size: '100%', round: true }),
                        ),
                        React.createElement('textarea', { placeholder: "What's on your mind?" }),

                        ),
                    React.createElement('div', {className: 'post-button-container'},
                        React.createElement(
                            'ul',
                            null,
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'a',
                                    {href:"#"},
                                    React.createElement(FontAwesomeIcon, { icon: faCamera, style: { marginRight: '10px' } }),
                                    'Photo/film'
                                )
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'a',
                                    {href: "#"},
                                    React.createElement(FontAwesomeIcon, { icon: faVideo, style: { marginRight: '10px' } }),
                                    'Live video broadcast'
                                ),
                            ),
                            React.createElement(
                                'li',
                                null,
                                React.createElement(
                                    'a',
                                    {href: "#"},
                                    React.createElement(FontAwesomeIcon, { icon: faCalendar, style: { marginRight: '10px' } }),
                                    'Life events'
                                )
                            )
                        )
                        ),

                    React.createElement('button', { className: 'post-btn' }, 'Publish')
                ),
                React.createElement('div', { className: 'posts' },


                )



            ),


    )
    );



    return React.createElement(
        React.Fragment,
        null,
        createHeader(),
        profileSection
    );
}

export default Profil;
