import React from 'react';
import "../css/header.css";

function Header(): React.ReactElement{
    return React.createElement(

        'header',
        {className: 'header'},
        React.createElement(
            'div',
            {className: 'logo'},
            React.createElement('h1', null, 'Astronomy Social App'),
            React.createElement(
                'nav',
                null,
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'a',
                            { href: '/Auth/login' },
                            'Log in'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'a',
                            {href: '/Auth/register'},
                            'Register'
                        )
                    )
                )
            )

        )

    );

}

export default Header;