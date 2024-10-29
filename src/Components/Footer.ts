import React from 'react';
import "../css/footer.css";

function Footer(): React.ReactElement {
    return React.createElement(
        'div',
        { className: 'footer' },
        React.createElement(
            'div',
            { className: 'footer-text' },
            React.createElement('p', null, '© 2024 Amelia Nawrot. All rights reserved.'),

        ),
        React.createElement(
            'div',
            { className: 'footer-icons' },
            React.createElement(
                'a',
                { href: 'https://instagram.com', target: '_blank', rel: 'noopener noreferrer' },
                React.createElement('i', { className: 'fab fa-instagram' })
            ),
            React.createElement(
                'a',
                { href: 'https://linkedin.com', target: '_blank', rel: 'noopener noreferrer' },
                React.createElement('i', { className: 'fab fa-linkedin' })
            ),
            React.createElement(
                'a',
                { href: 'https://github.com', target: '_blank', rel: 'noopener noreferrer' },
                React.createElement('i', { className: 'fab fa-github' })
            )
        )
    );
}

export default Footer;
