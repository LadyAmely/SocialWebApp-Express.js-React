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
            ),
            React.createElement(
              'div',
                {className: 'hero-button-container'},
                React.createElement(
                    'button',
                    {className: 'hero-button'},
                    React.createElement('p', null, 'Join the Journey')
                )
            )
        ),
        React.createElement('div', { className: 'hero-image' }),
        ),
        React.createElement(Footer)
    );
}

export default Home;
