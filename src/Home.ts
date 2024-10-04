import React from 'react';
import './css/home.css';
import Header from './Components/Header';
import Footer from './Components/Footer';

function Home(): React.ReactElement{
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(Header),
        React.createElement(
        'section',
        { className: 'hero' },
        React.createElement(
            'div',
            { className: 'hero-content' },
            React.createElement('h1', null, 'Explore the Universe Together'),
            React.createElement(
                'div',
                {className: 'typewriter'},
                React.createElement(
                    'div',
                    {className: 'typewriter-text'},
                    React.createElement('p', null, 'Join a community of stargazers, amateur astronomers, and space enthusiasts.'),
                )
            )
        ),
        React.createElement('div', { className: 'hero-image' })
        ),
        React.createElement(
            'div',
            {className: 'grid-layout'},
            React.createElement(
                'div',
                {className: 'grid-card'},
                React.createElement('h3', null, 'Chat with astronomy experts'),
                React.createElement('p', null, 'ask questions and stay up to date with the latest discoveries!')
            ),
            React.createElement(
                'div',
                {className: 'grid-card'},
                React.createElement('h3', null, 'Create events and meetups'),
                React.createElement('p', null, 'Connect with other astronomy enthusiasts at local and online events!')
            ),
            React.createElement(
                'div',
                {className: 'grid-card'},
                React.createElement('h3', null, 'Build your own observations'),
                React.createElement('p', null, 'Record your findings and create notes that will help you in your further development!')
            ),
            React.createElement(
                'div',
                {className: 'grid-card'},
                React.createElement('h3', null, 'Explore the sky together'),
                React.createElement('p', null, 'Use the forum feature to share experiences and exchange ideas with others!')
            ),
            React.createElement(
                'div',
                {className: 'grid-card'},
                React.createElement('h3', null, 'Be part of the galactic community'),
                React.createElement('p', null, 'Exchange ideas, experiences and passion for astronomy!')

            )
        ),
        React.createElement(Footer)
    );
}

export default Home;
