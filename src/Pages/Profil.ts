import React, { useEffect, useState } from "react";
import Avatar from 'react-avatar';
import Vibrant from 'node-vibrant';
import { useAuth } from "../context/AuthContext";
import "../css/pages/profil.css";
import {faBinoculars, faCog, faComments, faHome, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCamera, faVideo, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper, faInfoCircle, faUserFriends, faImage, faFilm, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt, faHeart, faEye, faStar } from '@fortawesome/free-solid-svg-icons';
import {FaComment, FaShare, FaThumbsUp} from "react-icons/fa";
import CommentMain from "../Components/CommentMain";
import DropMenu from "../Components/DropMenu";


function Profil(): React.ReactElement {
    const { username } = useAuth();
    const displayName = username || 'Unknown User';
    const [imageUrl, setImageUrl] = useState<string>("/best.jpg");
    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
    const [fileInputKey, setFileInputKey] = useState<number>(0);
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [newPostDescription, setNewPostDescription] = useState<string>("");
    const [newPostImage, setNewPostImage] = useState<string | null>(null);
    const [isEditWindowVisible, setEditWindowVisible] = React.useState(false);
    const [newLocation, setNewLocation] = useState<string>("");
    const [newInterests, setNewInterests] = useState<string>("");
    const [newObservations, setNewObservations] = useState<string>("");
    const [newConstellations, setNewConstellations] = useState<string>("");
   // const [friends, setFriends] = useState<string[]>([]);
    const [isDropMenu, setDropMenu] = React.useState(false);

    const [postId, setPostId] = useState<number | null>(null);

    const toggleMenuWindow = () => {
        setDropMenu(!isDropMenu);
    };

    interface Friend {
        friend_user: string;

    }

    interface aboutUser{
        location: string,
        interests: string,
        observations: string,
        constellations: string,
    }

    const [friends, setFriends] = useState<Friend[]>([]);

    const [userInfo, setUserInfo] = useState<aboutUser[]>([]);

    function handleDescriptionChange(event: React.ChangeEvent<HTMLTextAreaElement>) {

        setNewPostDescription(event.target.value);
    }

    function handleLocationChange(event: React.ChangeEvent<HTMLTextAreaElement>){
        setNewLocation(event.target.value);
    }

    function handleInterestsChange(event: React.ChangeEvent<HTMLTextAreaElement>){
        setNewInterests(event.target.value);
    }

    function handleObservationsChange(event: React.ChangeEvent<HTMLTextAreaElement>){
        setNewObservations(event.target.value);
    }

    function handleConstellationsChange(event: React.ChangeEvent<HTMLTextAreaElement>){
        setNewConstellations(event.target.value);
    }

    useEffect(() => {
        const storedImageUrl = localStorage.getItem('profileImage');
        if (storedImageUrl) {
            setImageUrl(storedImageUrl);
        }
    }, []);

    const deletePost = async () => {

        if (!postId) {
            console.error("postId is null, cannot delete post");
            return;
        }

        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Coś poszło nie tak');
            }

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (postId) {
            deletePost();
        }
    }, [postId]);

        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`/api/user-info/${username}`);
                if (!response.ok) {
                    throw new Error('Błąd sieci - nie udało się pobrać danych');
                }
                const data = await response.json();

                setUserInfo(data);
            } catch (err) {
                console.error('Błąd:', err);
            }
        };


    useEffect(() => {
        fetchUserInfo();
    }, [username]);

    const fetchFriends = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/friends/${username}`);
            const data = await response.json();
            console.log("Fetched friends:", data);
            setFriends(data);
        }catch(err){
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [username]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/auth/users');
                const data = await response.json();
                console.log("Fetched users: ", data);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(()=>{
        const fetchPosts = async() =>{
            try{
                const response = await fetch('http://localhost:5000/api/posts');
                const data = await response.json();
                console.log("Fetched posts:", data);
                setPosts(data);
            }catch(error){
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const toggleEditWindow = () => {
        setEditWindowVisible(!isEditWindowVisible);
    };

    const postUserInfo = async() =>{
        const newUserInfo = {
            username: username,
            location: newLocation,
            interests: newInterests,
            observations: newObservations,
            constellations: newConstellations
        };
        try{
            const response = await fetch('http://localhost:5000/api/user-info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUserInfo),
            });

            if (!response.ok) {
                throw new Error('Failed to user data');
            }

            await fetchUserInfo();

           // const data = await response.json();
            setNewConstellations('');
            setNewLocation('');
            setNewInterests('');
            setNewObservations('');

        }catch(error){
            console.log(error);
        }

    };

    const postPost = async () => {
        const newPost = {
            description: newPostDescription,
            image_path: newPostImage,
            username: username,
            created_at: new Date()
        };

        try {
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                throw new Error('Failed to post data');
            }

            const data = await response.json();
            console.log('Post created successfully:', data);

            setPosts([...posts, { ...data, created_at: newPost.created_at }]);
            setNewPostDescription('');
            setNewPostImage(null);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    function createPostInProfile(
        user: { name: string; avatar: string | React.ReactNode; time: string },
        content: string,
        image: string,
        postId: number,
        username: string,
        setPostId: (id: number | null) => void,
        deletePost: () => void
    ): React.ReactElement {

        const handleDeletePost = () => {
            setPostId(postId);
            deletePost();
        };

        return React.createElement(
            'div',
            { className: 'post' },
            React.createElement(
                'div',
                { className: 'post-header' },
                typeof user.avatar === 'string'
                    ? React.createElement('img', {
                        src: user.avatar,
                        alt: 'User Avatar',
                        className: 'post-avatar'
                    })
                    : user.avatar,
                React.createElement(
                    'div',
                    { className: 'post-user-info' },
                    React.createElement('h2', null, user.name),
                    React.createElement('span', null,  user.time),
                ),
                React.createElement(
                    'button',
                    {className: 'delete-button', onClick: handleDeletePost},
                    React.createElement('i', { className: 'fas fa-trash' })
                )
            ),
            React.createElement(
                'div',
                { className: 'post-content' },
                React.createElement('p', null, content)
            ),
            React.createElement(
                'div',
                {className: 'post-image',

                    style: {
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '200px',
                    }
                }
            ),
            React.createElement(
                'div',
                { className: 'post-actions' },
                ['Like', 'Comment', 'Share'].map((action, index) => {
                    const icons = [FaThumbsUp, FaComment, FaShare];
                    return React.createElement(
                        'button',
                        { key: action },
                        React.createElement(icons[index], { style: { marginRight: '5px' } }),
                        action
                    );
                }),
            ),
            React.createElement(CommentMain,  { postId, username }),
        );
    }

    function aboutUserInfo(
        location:string,
        interests: string,
        observations: string,
        favouriteConstellations: string,

    ):React.ReactElement{

        return   React.createElement(
            'div',
            {className: 'user-stats'},
            React.createElement('p', null,  React.createElement(FontAwesomeIcon, { icon: faMapMarkerAlt }), ' Location: '+location),
            React.createElement('p', null, React.createElement(FontAwesomeIcon, { icon: faHeart }),' Interests: '+interests),
            React.createElement('p', null,   React.createElement(FontAwesomeIcon, { icon: faBinoculars }),' Observations: '+observations),
            React.createElement('p', null, React.createElement(FontAwesomeIcon, { icon: faStar }),' Favourite constellations: '+favouriteConstellations),
        );

    }

    function createHeader(username: string, toggleMenuWindow: () => void): React.ReactElement {
        const navItems = [
            { name: 'Home', icon: faHome, href: '/dashboard' },
            { name: 'Profile', icon: faUser, href: '/profile' },
            { name: 'Forum', icon: faComments, href: '/forum' },
            { name: 'Community', icon: faUsers, href: '/community' },

        ];

        return React.createElement(
            'header',
            { className: 'dashboard-header' },
            React.createElement(
                'div',
                { className: 'dashboard-header-left' },
                React.createElement('h1', { className: 'dashboard-logo' }, 'GalaxyFlow'),
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
                    { className: 'dashboard-header-left' },
                    React.createElement(
                        Avatar,
                        {
                            name: username,
                            size: '40',
                            round: true,
                            onClick: toggleMenuWindow
                        }
                    )
                ),

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
            const imageUrl = URL.createObjectURL(file);
            setNewPostImage(imageUrl);
        }
    }




    const handleSave = () => {
        postUserInfo();
        toggleEditWindow();
    };



    const userCard = React.createElement(

        'div',
        {className: 'user-card'},

         React.createElement('div', {className: 'user-header'}),
        React.createElement('div', {className: 'user-profile-photo'},
            React.createElement(Avatar, { name: username ?? 'User', size: '100%', round: true })
            ),
        React.createElement(
            'div',
            {className: 'user-details'},
                userInfo
                    .map((userInformation) =>
                      aboutUserInfo(
                          userInformation.location,
                          userInformation.interests,
                          userInformation.observations,
                          userInformation.constellations,
                          )
                    ),
            React.createElement(
                'button',
                {className: 'button-modern',  onClick: toggleEditWindow,},
                'Edit details'
            ),
            isEditWindowVisible &&
            React.createElement(
                'div',
                { className: 'edit-window' },
                React.createElement('h2', null, 'Edit details'),
                React.createElement(
                    'div',
                    {className: 'edit-window-smaller-container'},
                    React.createElement(FontAwesomeIcon, { icon: faMapMarkerAlt, style: { color: 'white'} }),
                    React.createElement('textarea', { placeholder: 'Enter location here...', className: 'edit-input',  value: newLocation,
                        onChange: handleLocationChange }),
                ),
                React.createElement(
                    'div',
                    {className: 'edit-window-smaller-container'},
                    React.createElement(FontAwesomeIcon, { icon: faHeart, style: { color: 'white'}  }),
                    React.createElement('textarea', { placeholder: 'Enter your interests here...', className: 'edit-input',  value: newInterests,
                        onChange: handleInterestsChange }),
                ),
                React.createElement(
                    'div',
                    {className: 'edit-window-smaller-container'},
                    React.createElement(FontAwesomeIcon, { icon: faEye, style: { color: 'white'} }),
                    React.createElement('textarea', { placeholder: 'Enter your observations here...', className: 'edit-input',  value: newObservations,
                        onChange: handleObservationsChange }),
                ),
                React.createElement(
                    'div',
                    {className: 'edit-window-smaller-container'},
                    React.createElement(FontAwesomeIcon, { icon: faStar, style: { color: 'white'} }),
                    React.createElement('textarea', {className:'edit-input', placeholder: 'Enter constellations here...',  value: newConstellations,
                        onChange: handleConstellationsChange }),
                ),

                React.createElement(
                    'button',
                    { onClick: handleSave},
                    'Save'
                )
            ),

        ),
    );



    const friendCard = React.createElement(
        'div',
        { className: 'friends-card' },
        React.createElement('h2', {style: {color: 'white'}}, 'Friends'),
        React.createElement(
            'div',
            { className: 'friends-list' },
            friends.length > 0 ? friends.map((friend, index) => (
                React.createElement(
                    'div',
                    { className: 'friend', key: index },
                    React.createElement(
                        'div',
                        { className: 'friend-photo' },
                        React.createElement(Avatar, { name: friend.friend_user, size: '100', round: false })
                    ),
                    React.createElement(
                        'div',
                        { className: 'friend-info' },
                        React.createElement('h4', null, friend.friend_user),
                        React.createElement('p', null)
                    )
                )
            )) : React.createElement('p', null, 'Brak przyjaciół do wyświetlenia.')
        )
    );



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
                                React.createElement('h2', null, username ?? 'User'),
                                React.createElement(
                                    'p',
                                    null,
                                    '3 friends'
                                )
                            ),

                        ),

    React.createElement('div', {className: 'profile-top-menu'},

        React.createElement(
            'ul',
            null,
            React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    {href: '#'},
                    React.createElement(FontAwesomeIcon, { icon: faNewspaper, style: { marginRight: '10px' } }),
                    'Posts'
                )
            ),
            React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    {href: '#'},
                    React.createElement(FontAwesomeIcon, { icon: faInfoCircle, style: { marginRight: '10px' } }),
                    'Information'
                )
            ),
            React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    {href: '#'},
                    React.createElement(FontAwesomeIcon, { icon: faUserFriends, style: { marginRight: '10px' } }),
                    'Friends'
                )
            ),
            React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    {href: '#'},
                    React.createElement(FontAwesomeIcon, { icon: faImage, style: { marginRight: '10px' } }),
                    'Photos'
                )
            ),
            React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    {href: '#'},
                    React.createElement(FontAwesomeIcon, { icon: faFilm, style: { marginRight: '10px' } }),
                    'Films'
                )
            ),

            React.createElement(
                'li',
                null,
                React.createElement(
                    'a',
                    {href: '#'},
                    React.createElement(FontAwesomeIcon, { icon: faEllipsisH, style: { marginRight: '10px' } }),
                    'More'
                )
            )
    ),
),
                        )
                ),
            ),
            React.createElement('div', {className: 'profile-dark-container'},

                React.createElement('div', {className: 'profile-first-container'},
                       userCard,
                       friendCard,

                ),

                React.createElement('div', {className: 'profile-second-container'},

                    React.createElement('div', { className: 'create-post' },
                        React.createElement('div', {className: 'post-line'},

                            React.createElement('div', {className: 'post-photo'},
                                React.createElement(Avatar, { name: username ?? 'User', size: '100%', round: true }),
                            ),
                            React.createElement('textarea', { placeholder: "What's on your mind?",
                                value: newPostDescription,
                                onChange: handleDescriptionChange
                            },),

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
                                        {
                                            href:"#",
                                            onClick: () => document.getElementById('file-input')?.click()
                                        },

                                        React.createElement(FontAwesomeIcon, { icon: faCamera, style: { marginRight: '10px' } }),
                                        'Photo/film'
                                    )
                                ),
                                React.createElement('input', {
                                    id: 'file-input',
                                    type: 'file',
                                    accept: 'image/*',
                                    style: { display: 'none' },
                                    onChange: handleFileChange
                                }),
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

                        React.createElement('button', { className: 'post-btn', onClick: postPost }, 'Publish')
                    ),


                    React.createElement('div', {className: 'profile-posts'},


                        posts
                            .filter(post => post.username === username)
                            .map((post) =>
                                createPostInProfile(
                                    {
                                        name: post.username,
                                        avatar: React.createElement(Avatar, { name: post.username, size: '50', round: true }),
                                        time: new Date(post.created_at).toLocaleString(),
                                    },
                                    post.description,
                                    post.image_path,
                                    post.post_id,
                                    displayName,
                                    setPostId,
                                    deletePost

                                )
                            ),

                        ),

                    ),
            ),
        ),
);

    return React.createElement(
        React.Fragment,
        null,
        createHeader(displayName, toggleMenuWindow),
        profileSection
    );
}

export default Profil;
