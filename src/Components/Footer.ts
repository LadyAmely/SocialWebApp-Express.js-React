import React from 'react';
import "../css/footer.css";

function Footer():React.ReactElement{
    return React.createElement(

        'div',
        {className: 'footer'},
            React.createElement(
                'div',
                {className: 'footer-text'},
                React.createElement('p', null, '&copy; 2024 Amelia Nawrot. All rights reserved.')
            )

    );


}

export default Footer;